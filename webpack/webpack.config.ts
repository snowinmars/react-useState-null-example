import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { DefinePlugin, RuleSetRule, SourceMapDevToolPlugin, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { WebpackConfiguration } from 'webpack-cli';

import packageJson from './package.json';

import { allSrcTsTsxFiles } from './src/helpers/allSrcTsTsxFiles';
import { getDevtool } from './src/helpers/getDevtool';
import { parseExternalConfiguration } from './src/helpers/parseExternalConfiguration';
import { getPaths } from './src/helpers/paths';
import { WebpackEnv } from './src/helpers/types';
import { PackageJsonGeneratorPlugin } from './src/plugins/package-json-generator-plugin';

const configure = (webpackEnv: WebpackEnv): WebpackConfiguration => {
  const paths = getPaths();

  const [ vars, env ] = parseExternalConfiguration(webpackEnv, {
    allowedPrefixes : [
      /NODE_ENV/,
      /BABEL_ENV/,
    ],
    processEnv : process.env,
  });

  return {
    mode    : vars.configuration,
    bail    : vars.isProd,
    devtool : getDevtool(vars),
    entry   : allSrcTsTsxFiles(),
    target  : 'node',

    output : {
      uniqueName    : packageJson.name,
      libraryTarget : 'umd',
      path          : paths.dist,
      publicPath    : paths.publicUrlOrPath,
      clean         : true,
      globalObject  : 'this',
    },

    watch        : vars.isDev,
    watchOptions : {
      ignored : [
        paths.nodeModules,
        paths.publicEnvGen,
      ],
    },

    resolve : {
      alias : {
      },
      fallback : {
      },
      modules : [
        'node_modules',
        paths.nodeModules,
        vars.isDev && paths.src,
      ].filter(Boolean) as string[],
      extensions : paths.moduleFileExtensions.map((ext) => `.${ext}`),
    },

    devServer : {
      port               : vars.port,
      historyApiFallback : true,
      devMiddleware      : {
        writeToDisk : true,
      },
    },

    module : {
      strictExportPresence : true,
      rules                : [
        // Handle node_modules packages that contain sourcemaps
        vars.sourceMap && {
          enforce : 'pre',
          exclude : /@babel(?:\/|\\{1,2})runtime/,
          test    : /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader  : require.resolve('source-map-loader'),
        },

        {
          oneOf : [
            {
              test : /\.ts?$/,
              use  : [
                {
                  loader  : 'ts-loader',
                  options : {
                    onlyCompileBundledFiles : true,
                    transpileOnly           : false,
                  },
                },
              ],
              exclude : /node_modules/,
            },
          ],
        },
      ].filter(Boolean) as RuleSetRule[],
    },
    plugins : [
      new CleanWebpackPlugin(),
      new PackageJsonGeneratorPlugin({
        buildFolder        : paths.dist,
        currentPackageJson : packageJson,
      }),
      new DefinePlugin(env.stringified),
      vars.isDev && new CaseSensitivePathsPlugin(),
      vars.analyze && new BundleAnalyzerPlugin(),
      vars.sourceMap && new SourceMapDevToolPlugin({
        filename : '[file].map',
      }),
      new ForkTsCheckerWebpackPlugin({
        async      : vars.isDev,
        typescript : {
          build           : true,
          configFile      : paths.tsConfig,
          configOverwrite : {
            compilerOptions : {
            },
          },
          mode : 'write-references',
        },
      }),
    ].filter(Boolean) as WebpackPluginInstance[],

    optimization : {
      sideEffects : false,
      usedExports : true,
      nodeEnv     : vars.configuration,
      minimize    : vars.isProd,
      minimizer   : [ new TerserPlugin({
        terserOptions : {
          sourceMap : vars.sourceMap,
          ecma      : 2020,
          module    : true,
        },
      }) ],
    },

    stats : {
      children     : false,
      errorDetails : true,
    },
  };
};

module.exports = configure;
