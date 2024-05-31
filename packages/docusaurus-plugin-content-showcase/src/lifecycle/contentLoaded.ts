/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  ShowcaseItems,
  TagsOption,
} from '@docusaurus/plugin-content-showcase';
import type {PluginContentLoadedActions} from '@docusaurus/types';

export async function processContentLoaded({
  content,
  tags,
  routeBasePath,
  screenshotApi,
  addRoute,
  createData,
}: {
  content: ShowcaseItems;
  routeBasePath: string;
  tags: TagsOption;
  screenshotApi: string;
  addRoute: PluginContentLoadedActions['addRoute'];
  createData: PluginContentLoadedActions['createData'];
}): Promise<void> {
  addRoute({
    path: routeBasePath,
    component: '@theme/Showcase',
    context: {
      showcase: await createData('showcase.json', {
        items: content.items,
        tags,
        screenshotApi,
      }),
    },
    exact: true,
  });
}
