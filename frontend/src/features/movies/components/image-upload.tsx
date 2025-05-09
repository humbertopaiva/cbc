import React, { useCallback, useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import { s3UploadService } from '../services/s3-upload.service'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/context/auth.context'

interface ImageUploadProps {
  imageUrl: string | undefined
  onImageChange: (url: string) => void
  label: string
  movieTitle?: string
  folder?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUrl,
  onImageChange,
  label,
  movieTitle = 'default',
  folder = 'posters',
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const uploadImage = useCallback(
    async (file: File) => {
      if (!file) return

      setIsUploading(true)
      setUploadProgress(0)
      setError(null)

      try {
        // Fazer upload do arquivo usando XMLHttpRequest para acompanhar o progresso
        const userId = user?.id || 'anonymous'
        const xhr = new XMLHttpRequest()

        // Criar um nome de arquivo seguro com base no título do filme
        const sanitizedFileName = movieTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        const timestamp = Date.now()
        const extension = file.name.split('.').pop() || 'jpg'

        // Gera um nome de arquivo único
        const key = `${folder}/${userId}/${sanitizedFileName}-${timestamp}.${extension}`

        // Obter URL pré-assinada
        const presignedUrl = await s3UploadService.getPresignedUploadUrl(
          file,
          key,
        )

        // Configurar XMLHttpRequest para acompanhar o progresso
        xhr.open('PUT', presignedUrl)
        xhr.setRequestHeader('Content-Type', file.type)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(progress)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // A URL final da imagem
            const finalImageUrl = `http://localhost:9000/cubos-movies/${key}`
            onImageChange(finalImageUrl)
            setUploadProgress(100)
          } else {
            setError(`Falha no upload: ${xhr.status} ${xhr.statusText}`)
          }
          setIsUploading(false)
        }

        xhr.onerror = () => {
          setError('Erro de rede durante o upload.')
          setIsUploading(false)
        }

        xhr.send(file)
      } catch (error) {
        console.error('Error uploading image:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Erro desconhecido durante o upload.',
        )
        setIsUploading(false)
      }
    },
    [folder, movieTitle, onImageChange, user],
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        uploadImage(file)
      }
    },
    [uploadImage],
  )

  const handleUrlInput = useCallback(() => {
    const url = prompt('Digite a URL da imagem:')
    if (url && url.trim() !== '') {
      onImageChange(url.trim())
    }
  }, [onImageChange])

  const handleRemoveImage = useCallback(() => {
    onImageChange('')
  }, [onImageChange])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">{label}</label>

      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-48 object-cover rounded-md border"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/80"
            title="Remover imagem"
            type="button"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-input rounded-md p-6 flex flex-col items-center">
          <FiUpload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Clique para fazer upload ou use uma URL
          </p>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              <Button type="button" variant="outline" disabled={isUploading}>
                Escolher arquivo
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlInput}
              disabled={isUploading}
            >
              Usar URL
            </Button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {uploadProgress}% concluído
          </p>
        </div>
      )}

      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
}
