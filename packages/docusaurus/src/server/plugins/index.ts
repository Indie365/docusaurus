/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {generate} from '@docusaurus/utils';
import fs from 'fs-extra';
import path from 'path';
import {
  LoadContext,
  PluginConfig,
  PluginContentLoadedActions,
  RouteConfig,
} from '@docusaurus/types';
import initPlugins, {PluginWithVersionInformation} from './init';
import chalk from 'chalk';

export function sortConfig(routeConfigs: RouteConfig[]): void {
  // Sort the route config. This ensures that route with nested
  // routes is always placed last.
  routeConfigs.sort((a, b) => {
    if (a.routes && !b.routes) {
      return 1;
    }
    if (!a.routes && b.routes) {
      return -1;
    }
    // Higher priority get placed first.
    if (a.priority || b.priority) {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      const score = priorityB - priorityA;

      if (score !== 0) {
        return score;
      }
    }

    return a.path.localeCompare(b.path);
  });

  routeConfigs.forEach((routeConfig) => {
    routeConfig.routes?.sort((a, b) => a.path.localeCompare(b.path));
  });
}

export function warnAboutOverridingRoutes(
  pluginsRouteConfigs: RouteConfig[],
): void {
  // Accumulate all the routes by recursively exploring each RouteConfig
  const routesAccumulator: string[] = [];
  function getAllRoutes(routeConfigs: RouteConfig[]): string[] {
    for (let i = 0; i < routeConfigs.length; i += 1) {
      const routeConfig = routeConfigs[i];
      routesAccumulator.push(routeConfig.path);
      if (routeConfig.routes !== undefined) {
        getAllRoutes(routeConfig.routes);
      }
    }
    return routesAccumulator;
  }

  const allRoutes = getAllRoutes(pluginsRouteConfigs);

  // Sort the allRoutes array in lexicographical order
  // Then check if each route is equal to the next route
  // If yes, one of these routes will be overridden so we warn the user
  allRoutes.sort((a, b) => a.localeCompare(b));
  for (let i = 0; i < allRoutes.length - 1; i += 1) {
    if (allRoutes[i] === allRoutes[i + 1]) {
      console.warn(
        `${
          chalk.yellow(`warning `) + chalk.bold.yellow(`Routes Override: `)
        }Attempting to create page at "${
          allRoutes[i]
        }" but a page already exists at this path\n${chalk.bold.yellow(
          `This could lead to non-deterministic routing behavior`,
        )}`,
      );
    }
  }
}

export async function loadPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Promise<{
  plugins: PluginWithVersionInformation[];
  pluginsRouteConfigs: RouteConfig[];
}> {
  // 1. Plugin Lifecycle - Initialization/Constructor.
  const plugins: PluginWithVersionInformation[] = initPlugins({
    pluginConfigs,
    context,
  });

  // 2. Plugin Lifecycle - loadContent.
  // Currently plugins run lifecycle methods in parallel and are not order-dependent.
  // We could change this in future if there are plugins which need to
  // run in certain order or depend on others for data.
  const pluginsLoadedContent = await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.loadContent) {
        return null;
      }

      return plugin.loadContent();
    }),
  );

  // 3. Plugin Lifecycle - contentLoaded.
  const pluginsRouteConfigs: RouteConfig[] = [];

  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.contentLoaded) {
        return;
      }

      const pluginContentDir = path.join(
        context.generatedFilesDir,
        plugin.name,
      );

      const actions: PluginContentLoadedActions = {
        addRoute: (config) => pluginsRouteConfigs.push(config),
        createData: async (name, content) => {
          const modulePath = path.join(pluginContentDir, name);
          await fs.ensureDir(path.dirname(modulePath));
          await generate(pluginContentDir, name, content);
          return modulePath;
        },
      };

      await plugin.contentLoaded({
        content: pluginsLoadedContent[index],
        actions,
      });
    }),
  );

  warnAboutOverridingRoutes(pluginsRouteConfigs);

  // 4. Plugin Lifecycle - routesLoaded.
  // Currently plugins run lifecycle methods in parallel and are not order-dependent.
  // We could change this in future if there are plugins which need to
  // run in certain order or depend on others for data.
  await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.routesLoaded) {
        return null;
      }

      return plugin.routesLoaded(pluginsRouteConfigs);
    }),
  );

  // Sort the route config. This ensures that route with nested
  // routes are always placed last.
  sortConfig(pluginsRouteConfigs);

  return {
    plugins,
    pluginsRouteConfigs,
  };
}
