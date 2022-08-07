import path from 'path';

import { getDevtool } from '@snowinmars/webpack/helpers/getDevtool';
import { parseExternalConfiguration } from '@snowinmars/webpack/helpers/parseExternalConfiguration';
import { getPaths } from '@snowinmars/webpack/helpers/paths';
import { WebpackEnv } from '@snowinmars/webpack/helpers/types';
import { EnvGeneratorPlugin } from '@snowinmars/webpack/plugins/env-generator-plugin';
import { PackageJsonGeneratorPlugin } from '@snowinmars/webpack/plugins/package-json-generator-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
// @ts-ignore
import InterpolateHtmlPlugin from 'interpolate-html-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { DefinePlugin, RuleSetRule, SourceMapDevToolPlugin, WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { WebpackConfiguration } from 'webpack-cli';
import { InternalOptions, Manifest, WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { FileDescriptor } from 'webpack-manifest-plugin/dist/helpers';

import packageJson from './package.json';

const hasJsxRuntime = ((): boolean => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') return false;

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e: unknown) {
    return false;
  }
})();

const configure = (webpackEnv: WebpackEnv): WebpackConfiguration => {
  const paths = getPaths();

  const [ vars, env ] = parseExternalConfiguration(webpackEnv, {
    dotenvFiles : [
      paths.dotenv,
    ],
    allowedPrefixes : [
      /NODE_ENV/,
      /BABEL_ENV/,
      /KLOUD_.*/,
    ],
    processEnv : process.env,
  });

  return {
    mode    : vars.configuration,
    bail    : vars.isProd,
    devtool : getDevtool(vars),
    entry   : paths.srcIndex,
    target  : 'web',

    output : {
      uniqueName          : packageJson.name,
      libraryTarget       : 'umd',
      path                : paths.dist,
      publicPath          : paths.publicUrlOrPath,
      filename            : 'index.[contenthash].js',
      chunkFilename       : '[name].[contenthash].js',
      cssFilename         : '[name].[contenthash].[ext]',
      assetModuleFilename : '[name].[contenthash].[ext]',
      sourceMapFilename   : '[name].[contenthash].map',
      clean               : true,
      globalObject        : 'this',
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
        'src' : paths.src,
      },
      fallback : {
      },
      modules : [
        'node_modules',
        paths.nodeModules,
        vars.isDev && paths.src,
      ].filter(Boolean) as string[],
      extensions : paths.moduleFileExtensions.map((ext: string) => `.${ext}`),
    },

    devServer : {
      port               : vars.port,
      historyApiFallback : true,
      hot                : true,
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
            // TODO: Merge this config once `image/avif` is in the mime-db
            // https://github.com/jshttp/mime-db
            {
              test     : [ /\.avif$/ ],
              type     : 'asset',
              mimetype : 'image/avif',
              parser   : {
                dataUrlCondition : {
                  maxSize : 10_000,
                },
              },
            },
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test   : [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
              type   : 'asset',
              parser : {
                dataUrlCondition : {
                  maxSize : 10_000,
                },
              },
            },
            {
              test : /\.svg$/,
              use  : [
                {
                  loader : 'babel-loader',
                },
                {
                  loader  : 'react-svg-loader',
                  options : {
                    svgo : {
                      plugins : [
                        { removeTitle: false },
                      ],
                      floatPrecision : 2,
                    },
                    jsx : true,
                  },
                },
              ],
            },
            {
              // - apply class name hashing
              // - inject into html head
              test : /\.module\.(scss|css)$/,
              use  : [
                vars.isDev ? {
                  loader  : MiniCssExtractPlugin.loader,
                  options : {
                    esModule : true,
                  },
                } : {
                  loader  : 'style-loader',
                  options : {
                    insert   : '#insert-css-here',
                    esModule : true,
                  },
                },
                {
                  loader  : 'css-loader',
                  options : {
                    importLoaders : 1,
                    modules       : {
                      namedExport            : false,
                      localIdentName         : vars.isDev ? '[local]--[hash:base64:4]' : '[hash:base64:4]',
                      exportLocalsConvention : 'camelCaseOnly',
                    },
                    sourceMap : vars.sourceMap,
                  },
                },
                {
                  loader  : 'sass-loader',
                  options : {
                    sourceMap : vars.sourceMap,
                  },
                },
              ],
            },
            {
              // - do not apply class name hashing
              // - serve as separate files to allow exporting
              test : /\.global\.(scss|css)$/,
              use  : [
                {
                  loader  : MiniCssExtractPlugin.loader,
                  options : {
                    esModule : false,
                  },
                },
                {
                  loader  : 'css-loader',
                  options : {
                    importLoaders : 1,
                    modules       : false,
                    sourceMap     : vars.sourceMap,
                  },
                },
                {
                  loader  : 'sass-loader',
                  options : {
                    sourceMap : vars.sourceMap,
                  },
                },
              ],
            },
            // - do not apply class name hashing
            {
              test : /\.(scss|css)$/,
              use  : [
                vars.isDev ? {
                  loader  : MiniCssExtractPlugin.loader,
                  options : {
                    esModule : false,
                  },
                } : {
                  loader  : 'style-loader',
                  options : {
                    insert   : '#insert-css-here',
                    esModule : false,
                  },
                },
                {
                  loader  : 'css-loader',
                  options : {
                    importLoaders : 1,
                    modules       : false,
                    sourceMap     : vars.sourceMap,
                  },
                },
                {
                  loader  : 'sass-loader',
                  options : {
                    sourceMap : vars.sourceMap,
                  },
                },
              ],
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test    : [ /\.js$/, /\.mjs$/, /\.jsx$/, /\.ts$/, /\.tsx$/ ],
              include : [ paths.src, path.join(paths.nodeModules, '@kloud') ],
              loader  : require.resolve('babel-loader'),
              options : {
                sourceMaps     : vars.sourceMap,
                inputSourceMap : vars.sourceMap,
                customize      : require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets : [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime : hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],

                plugins : [
                  vars.isDev &&
                  require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory   : true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression : false,
                compact          : vars.isProd,
              },
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test    : [ /\.js$/, /\.mjs$/, /\.jsx$/ ],
              exclude : /@babel(?:\/|\\{1,2})runtime/,
              loader  : require.resolve('babel-loader'),
              options : {
                babelrc    : false,
                configFile : false,
                compact    : false,
                presets    : [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory   : true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression : false,

                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps     : vars.sourceMap,
                inputSourceMap : vars.sourceMap,
              },
            },
            {
              test : /\.(woff(2)?|eot|ttf|otf|)$/,
              type : 'asset/inline',
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude : [ /^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/ ],
              type    : 'asset/resource',
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ].filter(Boolean) as RuleSetRule[],
    },
    plugins : [
      new CleanWebpackPlugin(),
      vars.isDev && new ReactRefreshWebpackPlugin(),
      new PackageJsonGeneratorPlugin({
        buildFolder        : paths.dist,
        currentPackageJson : packageJson,
      }),
      // generate env during webpack build for dev
      // generate env during docker  start for prod
      new EnvGeneratorPlugin({
        filePaths : [
          paths.publicEnvGen,
          paths.distEnvGen,
        ],
        env : env.raw,
      }),
      new HtmlWebPackPlugin({
        title    : 'Common-web',
        filename : 'index.html',
        template : 'public/index.html',
        inject   : true,
        favicon  : paths.publicFavicon,
        meta     : {
          'viewport'     : 'width=device-width, initial-scale=1, shrink-to-fit=no',
          'theme-color'  : '#ffffff',
          'description'  : 'Common-web',
          'charset'      : 'utf-8',
          'gitHash'      : vars.gitHash,
          'Content-Type' : 'text/html;charset=UTF-8',
        },
        minify : vars.isProd && {
          removeComments                : true,
          collapseWhitespace            : true,
          removeRedundantAttributes     : true,
          useShortDoctype               : true,
          removeEmptyAttributes         : true,
          removeStyleLinkTypeAttributes : true,
          keepClosingSlash              : true,
          minifyJS                      : true,
          minifyCSS                     : true,
          minifyURLs                    : true,
        },
      }),
      new HtmlInlineScriptPlugin([
        new RegExp(paths.publicEnvGen),
      ]),
      new CopyPlugin({
        patterns : [
          paths.publicEnvGen,
          paths.publicManifest,
          paths.publicRobots,
        ].map((name) => ({ from: name, to: 'public' })),
      }),
      vars.isProd && new InlineChunkHtmlPlugin(HtmlWebPackPlugin, [ /runtime-.+[.]js/ ]),
      // @ts-ignore
      new InterpolateHtmlPlugin(HtmlWebPackPlugin, env.raw), // Makes some environment variables available in index.html.
      new DefinePlugin(env.stringified),
      vars.isDev && new CaseSensitivePathsPlugin(),
      new WebpackManifestPlugin({
        fileName   : 'manifest.json',
        publicPath : paths.publicUrlOrPath,
        generate   : (seed: Record<string, string>, files: FileDescriptor[], entries: Record<string, string[]>): Manifest => {
          const manifestFiles = files.reduce((manifest: Record<string, string>, file: FileDescriptor): Record<string, string> => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);

          const entrypointFiles = entries.main.filter(
            (fileName) => !fileName.endsWith('.map')
          ).join(';');

          return {
            ...manifestFiles,
            'entrypoints' : entrypointFiles,
          };
        },
      } as Partial<InternalOptions>),
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
      new MiniCssExtractPlugin({
        filename : '[name].[contenthash].css',
        insert   : '#insert-css-here',
      }),
      vars.isProd && new CompressionPlugin(),
      new SourceMapDevToolPlugin({
        filename : '[file].map',
      }),
      vars.analyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean) as WebpackPluginInstance[],

    optimization : {
      sideEffects : false,
      usedExports : true,
      nodeEnv     : process.env.NODE_ENV,
      minimize    : vars.isProd,
      minimizer   : [ new TerserPlugin({
        terserOptions : {
          sourceMap : vars.isDev,
          ecma      : 2020,
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
