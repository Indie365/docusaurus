/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import escapeHtml from 'escape-html';
import toString from 'mdast-util-to-string';
// eslint-disable-next-line import/no-unresolved
import type {Parent} from 'unist';
// eslint-disable-next-line import/no-unresolved
import type {StaticPhrasingContent, Heading} from 'mdast';

function stringifyContent(node: Parent) {
  return (node.children as StaticPhrasingContent[]).map(toValue).join('');
}

export function toValue(node: StaticPhrasingContent | Heading): string {
  if (node && node.type) {
    switch (node.type) {
      case 'text':
        return escapeHtml(node.value);
      case 'heading':
        return stringifyContent(node);
      case 'inlineCode':
        return `<code>${escapeHtml(node.value)}</code>`;
      case 'emphasis':
        return `<em>${stringifyContent(node)}</em>`;
      case 'strong':
        return `<strong>${stringifyContent(node)}</strong>`;
      case 'delete':
        return `<del>${stringifyContent(node)}</del>`;
      default:
    }
  }

  return toString(node);
}
