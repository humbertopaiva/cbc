import { gql } from '@apollo/client'
import { apolloClient } from '@/core/lib/apollo'

const GET_PRESIGNED_URL = gql`
  mutation GetPresignedUploadUrl($input: PresignedUrlInput!) {
    getPresignedUploadUrl(input: $input) {
      presignedUrl
      key
      fileUrl
    }
  }
`

interface PresignedUrlResponse {
  getPresignedUploadUrl: {
    presignedUrl: string
    key: string
    fileUrl: string
  }
}

interface PresignedUrlInput {
  folder: string
  filename: string
}

class S3UploadService {
  async getPresignedUploadUrl(
    file: File,
    folder: string,
  ): Promise<{ presignedUrl: string; fileUrl: string }> {
    try {
      console.log(`Getting presigned URL for ${file.name} in folder ${folder}`)

      const { data } = await apolloClient.mutate<
        {
          getPresignedUploadUrl: PresignedUrlResponse['getPresignedUploadUrl']
        },
        { input: PresignedUrlInput }
      >({
        mutation: GET_PRESIGNED_URL,
        variables: {
          input: {
            folder,
            filename: file.name,
          },
        },
      })

      if (!data) {
        throw new Error('Failed to get presigned URL')
      }

      console.log('Got presigned URL:', data.getPresignedUploadUrl.presignedUrl)

      return {
        presignedUrl: data.getPresignedUploadUrl.presignedUrl,
        fileUrl: data.getPresignedUploadUrl.fileUrl,
      }
    } catch (error) {
      console.error('Error getting presigned URL:', error)
      throw error
    }
  }

  async uploadFileWithPresignedUrl(
    file: File,
    presignedUrl: string,
  ): Promise<void> {
    try {
      console.log(
        `Uploading file ${file.name} (${file.size} bytes) to ${presignedUrl}`,
      )

      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
      })

      if (!response.ok) {
        const responseText = await response.text()
        console.error('Upload failed. Response:', responseText)
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        )
      }

      console.log('Upload successful!')
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  async uploadFile(file: File, folder: string): Promise<string> {
    try {
      // Obter URL pré-assinada
      const { presignedUrl, fileUrl } = await this.getPresignedUploadUrl(
        file,
        folder,
      )

      console.log('Presigned URL:', presignedUrl) // <-- Adicione esta linha

      // Fazer o upload com fetch
      await this.uploadFileWithPresignedUrl(file, presignedUrl)

      // Retornar a URL final da imagem
      return fileUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }
}

export const s3UploadService = new S3UploadService()
