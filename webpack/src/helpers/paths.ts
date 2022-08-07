import { mkdirSync, existsSync, realpathSync } from 'fs';
import { resolve } from 'path';

import { WebpackPaths } from './types';

const appDirectory: string = realpathSync(process.cwd());

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'web.jsx',
  'jsx',
  'web.js',
  'js',
  'json',
];

const resolveApp = (relativePath: string): string => resolve(appDirectory, relativePath);

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn: (x: string) => string, filePath: string, moduleFileExtensions: string[]): string => {
  const extension = moduleFileExtensions.find((extension) => existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) return resolveFn(`${filePath}.${extension}`);

  return resolveFn(`${filePath}.js`);
};

export const getPaths = (overrides?: Partial<WebpackPaths> | undefined): WebpackPaths => {
  const paths: WebpackPaths = {
    dotenv               : resolveApp(overrides?.dotenv ?? '.env'),
    root                 : resolveApp(overrides?.root ?? '.'),
    publicUrlOrPath      : overrides?.publicUrlOrPath ?? '/',
    public               : resolveApp(overrides?.public ?? 'public'),
    publicHtml           : resolveApp(overrides?.publicHtml ?? 'public/index.html'),
    publicEnvGen         : resolveApp(overrides?.publicEnvGen ?? 'public/env-config.js.gen'),
    publicManifest       : resolveApp(overrides?.publicEnvGen ?? 'public/manifest.json'),
    publicRobots         : resolveApp(overrides?.publicEnvGen ?? 'public/robots.txt'),
    publicFavicon        : resolveApp(overrides?.publicFavicon ?? 'public/favicon.ico'),
    packageJson          : resolveApp(overrides?.packageJson ?? 'package.json'),
    yarnLockFile         : resolveApp(overrides?.yarnLockFile ?? 'yarn.lock'),
    tsConfig             : resolveApp(overrides?.tsConfig ?? 'tsconfig.json'),
    nodeModules          : resolveApp(overrides?.nodeModules ?? 'node_modules'),
    srcServiceWorker     : resolveModule(resolveApp, overrides?.srcServiceWorker ??  'src/service-worker', moduleFileExtensions),
    webpackExtensions    : resolveApp(overrides?.webpackExtensions ?? 'webpack'),
    moduleFileExtensions : overrides?.moduleFileExtensions ?? moduleFileExtensions,
    src                  : resolveApp(overrides?.src ?? 'src'),
    srcIndex             : resolveModule(resolveApp, overrides?.srcIndex ??  'src/index', moduleFileExtensions),
    dist                 : resolveApp(overrides?.dist ?? 'dist'),
    distEnvGen           : resolveApp(overrides?.distEnvGen ?? 'dist/public/env-config.js.gen'),
    distIndexRelative    : overrides?.distIndexRelative ?? 'index.js',
  };

  if (!existsSync(paths.dist)) mkdirSync(paths.dist);

  return paths;
};
