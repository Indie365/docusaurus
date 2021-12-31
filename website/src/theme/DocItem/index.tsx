/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/DocItem';
import DocItem from '@theme-original/DocItem';

// This component is only used to test for CSS insertion order
import './styles.module.css';

export default function DocItemWrapper(props: Props): JSX.Element {
  return <DocItem {...props} />;
}
