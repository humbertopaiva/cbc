declare module 'graphql-upload/GraphQLUpload.mjs' {
  import { Readable } from 'stream';

  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Readable;
  }

  export const GraphQLUpload: {
    name: string;
    description: string;
    parseValue(value: any): any;
    parseLiteral(ast: any): any;
    serialize(): never;
  };
}

declare module 'graphql-upload/Upload.mjs' {
  export interface Upload {
    promise: Promise<any>;
  }
}

declare module 'graphql-upload/graphqlUploadExpress.mjs' {
  import { RequestHandler } from 'express';

  export interface Options {
    maxFieldSize?: number;
    maxFileSize?: number;
    maxFiles?: number;
  }

  export default function graphqlUploadExpress(options?: Options): RequestHandler;
}
