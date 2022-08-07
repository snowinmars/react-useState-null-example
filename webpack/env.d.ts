/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/consistent-type-definitions */
// / <reference types="node" />
// / <reference types="react" />
// / <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test' | undefined;
    readonly BABEL_ENV: 'development' | 'production' | 'test' | undefined;
  }
}
