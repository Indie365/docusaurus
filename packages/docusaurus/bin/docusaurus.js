#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const semver = require('semver');
const path = require('path');
const program = require('commander');
const {build, eject, init, deploy, start} = require('../lib');
const requiredVersion = require('../package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(
    chalk.red(`\nMinimum node version not met :)`) +
      chalk.yellow(
        `\nYou are using Node ${
          process.version
        }, Requirement: Node ${requiredVersion}.\n`,
      ),
  );
  process.exit(1);
}

function wrapCommand(fn) {
  return (...args) =>
    fn(...args).catch(err => {
      console.error(chalk.red(err.stack));
      process.exitCode = 1;
    });
}

program
  .version(require('../package.json').version)
  .usage('<command> [options]');

program
  .command('build [siteDir]')
  .description('Build website')
  .option(
    '--bundle-analyzer',
    'Visualize size of webpack output files with an interactive zoomable treemap (default = false)',
  )
  .option('--no-cache-loader', 'Do not use cache-loader')
  .action((siteDir = '.', {bundleAnalyzer, cacheLoader}) => {
    wrapCommand(build)(path.resolve(siteDir), {
      bundleAnalyzer,
      cacheLoader,
    });
  });

program
  .command('eject [siteDir]')
  .description('copy the default theme into website folder for customization.')
  .action((siteDir = '.') => {
    wrapCommand(eject)(path.resolve(siteDir));
  });

program
  .command('init [projectDir]')
  .description('Initialize website')
  .action((projectDir = '.') => {
    wrapCommand(init)(path.resolve(projectDir));
  });

program
  .command('deploy [siteDir]')
  .description('deploy website')
  .action((siteDir = '.') => {
    wrapCommand(deploy)(path.resolve(siteDir));
  });

program
  .command('start [siteDir]')
  .description('Start development server')
  .option('-p, --port <port>', 'use specified port (default: 3000)')
  .option('-h, --host <host>', 'use specified host (default: localhost')
  .option('-nw, --no-watch <noWatch>', 'disable live reload (default: false)')
  .option(
    '--hot-only',
    'Do not fallback to page refresh if hot reload fails (default: false)',
  )
  .option('--no-cache-loader', 'Do not use cache-loader')
  .action((siteDir = '.', {port, noWatch, hotOnly, cacheLoader}) => {
    wrapCommand(start)(path.resolve(siteDir), {
      port,
      noWatch,
      hotOnly,
      cacheLoader,
    });
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
