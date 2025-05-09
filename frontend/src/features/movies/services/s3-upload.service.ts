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
  contentType: string
}

class S3UploadService {
  async getPresignedUploadUrl(
    file: File,
    folder: string,
  ): Promise<{ presignedUrl: string; fileUrl: string }> {
    try {
      const { data } = await apolloClient.mutate<PresignedUrlResponse>({
        mutation: GET_PRESIGNED_URL,
        variables: {
          input: {
            folder,
            filename: file.name,
            contentType: file.type,
          },
        },
      })

      if (!data) {
        throw new Error('Failed to get presigned URL')
      }

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
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        )
      }
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
