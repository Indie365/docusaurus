/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback} from 'react';
import {isRegexpStringMatch} from '@docusaurus/theme-common';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {useAlgoliaThemeConfig} from './useAlgoliaThemeConfig';
import type {ThemeConfig} from '@docusaurus/theme-search-algolia';

type Replacer = (pathname: string) => string;

function replacePathname(
  pathname: string,
  replaceSearchResultPathname: ThemeConfig['algolia']['replaceSearchResultPathname'],
): string {
  return replaceSearchResultPathname
    ? pathname.replaceAll(
        new RegExp(replaceSearchResultPathname.from, 'g'),
        replaceSearchResultPathname.to,
      )
    : pathname;
}

// Translate search-engine agnostic search filters to Algolia search filters
export function useSearchResultUrlExtractor(): Replacer {
  const {withBaseUrl} = useBaseUrlUtils();
  const {
    algolia: {externalUrlRegex, replaceSearchResultPathname},
  } = useAlgoliaThemeConfig();

  return useCallback(
    (url: string) => {
      const parsedURL = new URL(url);

      // Algolia contains an external domain => navigate to URL
      if (isRegexpStringMatch(externalUrlRegex, parsedURL.href)) {
        return url;
      }

      // Otherwise => transform to relative URL for SPA navigation
      const relativeUrl = `${parsedURL.pathname + parsedURL.hash}`;

      return withBaseUrl(
        replacePathname(relativeUrl, replaceSearchResultPathname),
      );
    },
    [withBaseUrl, externalUrlRegex, replaceSearchResultPathname],
  );
}
