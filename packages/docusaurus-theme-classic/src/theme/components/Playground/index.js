/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';

import styles from './styles.module.css';

function Playground({children, theme, transformCode, ...props}) {
  return (
    <LiveProvider
      code={children}
      transformCode={transformCode || (code => `${code};`)}
      theme={theme}
      {...props}>
      <div className={styles.editorHeaderContainer}>
        <div className={styles.headerTitle}>LIVE EDITOR</div>
      </div>
      <LiveEditor className={styles.editorContainer} />
      <div className={styles.previewHeaderContainer}>
        <div className={styles.headerTitle}>PREVIEW</div>
      </div>
      <div className={styles.previewContainer}>
        <LivePreview />
        <LiveError />
      </div>
    </LiveProvider>
  );
}

export default Playground;
