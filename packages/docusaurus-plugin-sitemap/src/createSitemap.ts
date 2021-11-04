/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SitemapStream, streamToPromise} from 'sitemap';
import {PluginOptions} from './types';
import {DocusaurusConfig, RouteConfig} from '@docusaurus/types';
import {addTrailingSlash} from '@docusaurus/utils';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import {getAllFinalRoutes} from '@docusaurus/core/lib/server/utils';

export default async function createSitemap(
  siteConfig: DocusaurusConfig,
  routes: RouteConfig[],
  options: PluginOptions,
): Promise<string> {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('URL in docusaurus.config.js cannot be empty/undefined.');
  }
  const {changefreq, priority} = options;

  const sitemapStream = new SitemapStream({
    hostname,
  });
  const routesPaths = getAllFinalRoutes(routes);

  function applySitemapTrailingSlash(routePath: string): string {
    // kept for retrocompatibility
    // TODO remove deprecated trailingSlash option before 2022
    if (options.trailingSlash) {
      return addTrailingSlash(routePath);
    } else {
      return applyTrailingSlash(routePath, {
        trailingSlash: siteConfig.trailingSlash,
        baseUrl: siteConfig.baseUrl,
      });
    }
  }

  routesPaths
    .filter((route) => !route.path.endsWith('404.html'))
    .map((routePath) => {
      sitemapStream.write({
        url: applySitemapTrailingSlash(routePath.path),
        changefreq,
        priority,
        ...(typeof routePath.lastmod === 'number' && {
          lastmod: routePath.lastmod,
        }),
      });
    });

  sitemapStream.end();

  const generatedSitemap = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString(),
  );

  return generatedSitemap;
}
