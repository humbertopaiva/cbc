import { Scalar } from '@nestjs/graphql';
import { GraphQLError, GraphQLScalarType } from 'graphql';

export const GraphQLUploadScalar = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: value => {
    if (value === null || value === undefined) {
      throw new GraphQLError('Upload value cannot be null or undefined');
    }
    return value;
  },
  parseLiteral: () => {
    throw new GraphQLError('Upload literal unsupported.');
  },
  serialize: () => {
    throw new GraphQLError('Upload serialization unsupported.');
  },
});

@Scalar('Upload')
export class UploadScalar {
  description = 'File upload scalar type';

  parseValue(value: any) {
    return GraphQLUploadScalar.parseValue(value);
  }

  parseLiteral(ast: any) {
    return GraphQLUploadScalar.parseLiteral(ast);
  }

  serialize(value: any) {
    return GraphQLUploadScalar.serialize(value);
  }
}
