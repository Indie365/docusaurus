/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ComponentProps, ReactNode} from 'react';

import styles from './styles.module.css';

interface Props extends ComponentProps<'input'> {
  label: ReactNode;
  icon: ReactNode;
}

const ShowcaseCheckbox = React.forwardRef<HTMLLabelElement, Props>(
  function ShowcaseCheckbox({className, id, icon, label, ...rest}, ref) {
    return (
      <>
        <input type="checkbox" id={id} className="sr-only" {...rest} />
        <label
          ref={ref}
          htmlFor={id}
          className={styles.checkboxLabel}
          aria-describedby={id}>
          {label}
          {icon}
        </label>
      </>
    );
  },
);

export default ShowcaseCheckbox;
