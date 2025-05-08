import { Scalar } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

// Interface para o tipo de upload que usamos internamente
export interface Upload {
  promise: Promise<FileUpload>;
}

@Scalar('Upload')
export class UploadScalar {
  description = 'File upload scalar type';

  parseValue(value: unknown): Upload {
    if (value === null || value === undefined) {
      throw new GraphQLError('Upload value cannot be null or undefined');
    }

    // Validamos que temos uma Promise
    if (!(value instanceof Promise)) {
      throw new GraphQLError(`Upload value must be a Promise, received: ${typeof value}`);
    }

    // Tipamos explicitamente como Upload
    return { promise: value as Promise<FileUpload> };
  }

  serialize(): never {
    throw new GraphQLError('Upload serialization unsupported.');
  }
}
