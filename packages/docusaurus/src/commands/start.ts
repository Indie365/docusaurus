/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl} from '@docusaurus/utils';
import chalk = require('chalk');
import chokidar from 'chokidar';
import express from 'express';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import _ from 'lodash';
import path from 'path';
import portfinder from 'portfinder';
import openBrowser from 'react-dev-utils/openBrowser';
import {prepareUrls} from 'react-dev-utils/WebpackDevServerUtils';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'webpack-merge';
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin';
import {load} from '../server';
import {StartCLIOptions} from '@docusaurus/types';
import {posixPath} from '@docusaurus/utils';
import {CONFIG_FILE_NAME, STATIC_DIR_NAME, DEFAULT_PORT} from '../constants';
import {createClientConfig} from '../webpack/client';
import {applyConfigureWebpack} from '../webpack/utils';

function getHost(reqHost: string | undefined): string {
  return reqHost || 'localhost';
}

async function getPort(reqPort: string | undefined): Promise<number> {
  const basePort = reqPort ? parseInt(reqPort, 10) : DEFAULT_PORT;
  const port = await portfinder.getPortPromise({port: basePort});
  return port;
}

export async function start(
  siteDir: string,
  cliOptions: Partial<StartCLIOptions> = {},
): Promise<void> {
  process.env.NODE_ENV = 'development';
  process.env.BABEL_ENV = 'development';
  console.log(chalk.blue('Starting the development server...'));

  // Process all related files as a prop.
  const props = await load(siteDir);

  // Reload files processing.
  const reload = () => {
    load(siteDir).catch(err => {
      console.error(chalk.red(err.stack));
    });
  };
  const {siteConfig, plugins = []} = props;

  const normalizeToSiteDir = filepath => {
    if (filepath && path.isAbsolute(filepath)) {
      return posixPath(path.relative(siteDir, filepath));
    }
    return posixPath(filepath);
  };

  const pluginPaths: string[] = _.compact(
    _.flatten<string | undefined>(
      plugins.map(plugin => plugin.getPathsToWatch && plugin.getPathsToWatch()),
    ),
  ).map(normalizeToSiteDir);
  const fsWatcher = chokidar.watch([...pluginPaths, CONFIG_FILE_NAME], {
    cwd: siteDir,
    ignoreInitial: true,
  });
  ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(event =>
    fsWatcher.on(event, reload),
  );

  const protocol: string = process.env.HTTPS === 'true' ? 'https' : 'http';
  const port: number = await getPort(cliOptions.port);
  const host: string = getHost(cliOptions.host);
  const {baseUrl, headTags, preBodyTags, postBodyTags} = props;
  const urls = prepareUrls(protocol, host, port);
  const openUrl = normalizeUrl([urls.localUrlForBrowser, baseUrl]);

  let config: webpack.Configuration = merge(createClientConfig(props), {
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          '../client/templates/index.html.template.ejs',
        ),
        // so we can define the position where the scripts are injected
        inject: false,
        filename: 'index.html',
        title: siteConfig.title,
        headTags,
        preBodyTags,
        postBodyTags,
      }),
      // This is necessary to emit hot updates for webpack-dev-server
      new HotModuleReplacementPlugin(),
    ],
  });

  // Plugin lifecycle - configureWebpack
  plugins.forEach(plugin => {
    const {configureWebpack} = plugin;
    if (!configureWebpack) {
      return;
    }

    config = applyConfigureWebpack(
      configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
      config,
      false,
    );
  });

  // https://webpack.js.org/configuration/dev-server
  const devServerConfig: WebpackDevServer.Configuration = {
    compress: true,
    clientLogLevel: 'info',
    hot: true,
    hotOnly: cliOptions.hotOnly,
    quiet: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    publicPath: baseUrl,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: {
      rewrites: [{from: /\/*/, to: baseUrl}],
    },
    disableHostCheck: true,
    // Enable overlay on browser. E.g: display errors
    overlay: true,
    host,
    before: app => {
      app.use(baseUrl, express.static(path.resolve(siteDir, STATIC_DIR_NAME)));
      // TODO: add plugins beforeDevServer and afterDevServer hook
    },
  };
  WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, devServerConfig);
  devServer.listen(port, host, err => {
    if (err) {
      console.log(err);
    }
    cliOptions.open && openBrowser(openUrl);
  });
  ['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig as NodeJS.Signals, () => {
      devServer.close();
      process.exit();
    });
  });
}
