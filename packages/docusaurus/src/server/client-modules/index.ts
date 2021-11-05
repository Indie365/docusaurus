/**
 * Copyright (c) Meta Platforms, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Plugin} from '@docusaurus/types';

export default function loadClientModules(
  plugins: Plugin<unknown>[],
): string[] {
  return ([] as string[]).concat(
    ...plugins
      .map((plugin) => plugin.getClientModules?.() ?? [])
      .filter(Boolean),
  );
}
