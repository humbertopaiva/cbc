import { Scalar } from '@nestjs/graphql';
import { GraphQLError, GraphQLScalarType } from 'graphql';

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: value => value,
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
    return GraphQLUpload.parseValue(value);
  }

  parseLiteral(ast: any) {
    return GraphQLUpload.parseLiteral(ast);
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }
}
