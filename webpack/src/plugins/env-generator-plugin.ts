import { existsSync, unlinkSync, writeFileSync } from 'fs';

import { resolve } from 'path';

import { validate } from 'schema-utils';
import { Compiler } from 'webpack';

export class EnvGeneratorPlugin {
  private readonly options: EnvGeneratorPluginOptions;

  constructor(options: EnvGeneratorPluginOptions) {
    validate({
      type       : 'object',
      properties : {
        filePaths : {
          type : 'array',
        },
        env : {
          type : 'object',
        },
      },
    }, options, {
      name         : 'Env generator plugin',
      baseDataPath : 'options',
    });

    this.options = options;
  }

  apply(compiler: Compiler): void {
    const pluginName = EnvGeneratorPlugin.name;

    compiler.hooks.afterDone.tap(pluginName, () => {
      console.log(`\nGenerate env to ${this.options.filePaths.join(', ')}\n`);

      this.options.filePaths.forEach((filePath) => {
        const envGen = resolve(filePath);

        if (existsSync(envGen)) unlinkSync(envGen);

        writeFileSync(envGen, `window._env_ = ${JSON.stringify(this.options.env, null, 2)}\n`);
      });
    });
  }
}

export type EnvGeneratorPluginOptions = {
  readonly env: NodeJS.ProcessEnv;
  readonly filePaths: string[];
}
