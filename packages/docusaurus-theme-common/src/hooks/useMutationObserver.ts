/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useRef, useMemo, useEffect} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export function useMutationObserver(
  target: Element | undefined | null,
  callback: (mutations: MutationRecord[]) => void,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
): void {
  const mutationObserver = useRef<MutationObserver | undefined>(
    ExecutionEnvironment.canUseDOM ? new MutationObserver(callback) : undefined,
  );
  const memoOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const observer = mutationObserver.current;

    if (target && observer) {
      observer.observe(target, memoOptions);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [target, memoOptions]);
}
