import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

class S3UploadService {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minio_access_key',
        secretAccessKey: 'minio_secret_key',
      },
      forcePathStyle: true,
    })
  }

  async getPresignedUploadUrl(
    file: File,
    key: string,
    bucket: string = 'cubos-movies',
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: file.type,
    })

    return getSignedUrl(this.client, command, { expiresIn: 600 })
  }

  async uploadFile(
    file: File,
    folder: string,
    movieTitle: string,
    userId: string = 'user-' + Math.random().toString(36).substring(2, 9),
  ): Promise<string> {
    try {
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
      const presignedUrl = await this.getPresignedUploadUrl(file, key)

      // Fazer o upload com fetch
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
        )
      }

      // Retornar a URL final da imagem
      return `http://localhost:9000/cubos-movies/${key}`
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }
}

export const s3UploadService = new S3UploadService()
