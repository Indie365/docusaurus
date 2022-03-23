/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MouseEvent} from 'react';
import React, {isValidElement, useEffect, useState} from 'react';
import clsx from 'clsx';
import Highlight, {defaultProps, type Language} from 'prism-react-renderer';
import copy from 'copy-text-to-clipboard';
import {translate} from '@docusaurus/Translate';
import {
  useThemeConfig,
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  ThemeClassNames,
  usePrismTheme,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/CodeBlock';

import styles from './styles.module.css';

export default function CodeBlock({
  children,
  className: blockClassName = '',
  metastring,
  title,
  language: languageProp,
}: Props): JSX.Element {
  const {prism} = useThemeConfig();

  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  // The Prism theme on SSR is always the default theme but the site theme
  // can be in a different mode. React hydration doesn't update DOM styles
  // that come from SSR. Hence force a re-render after mounting to apply the
  // current relevant styles. There will be a flash seen of the original
  // styles seen using this current approach but that's probably ok. Fixing
  // the flash will require changing the theming approach and is not worth it
  // at this point.
  useEffect(() => {
    setMounted(true);
  }, []);

  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const codeBlockTitle = parseCodeBlockTitle(metastring) || title;
  const prismTheme = usePrismTheme();

  // <pre> tags in markdown map to CodeBlocks and they may contain JSX children.
  // When the children is not a simple string, we just return a styled block
  // without actually highlighting.
  if (React.Children.toArray(children).some((el) => isValidElement(el))) {
    return (
      <Highlight
        {...defaultProps}
        key={String(mounted)}
        theme={prismTheme}
        code=""
        language={'text' as Language}>
        {({className, style}) => (
          <pre
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
            tabIndex={0}
            className={clsx(
              className,
              styles.codeBlockStandalone,
              'thin-scrollbar',
              styles.codeBlockContainer,
              blockClassName,
              ThemeClassNames.common.codeBlock,
            )}
            style={style}>
            <code className={styles.codeBlockLines}>{children}</code>
          </pre>
        )}
      </Highlight>
    );
  }

  // The children is now guaranteed to be one/more plain strings
  const content = Array.isArray(children)
    ? children.join('')
    : (children as string);

  const language =
    languageProp ?? parseLanguage(blockClassName) ?? prism.defaultLanguage;
  const {highlightLines, code} = parseLines(content, metastring, language);

  const handleCopyCode = (e: MouseEvent<HTMLButtonElement>) => {
    copy(code);
    setIsCopied(true);

    const button = e.currentTarget;

    setTimeout(() => {
      setIsCopied(false);
      button.blur();
    }, 2000);
  };

  return (
    <Highlight
      {...defaultProps}
      key={String(mounted)}
      theme={prismTheme}
      code={code}
      language={(language ?? 'text') as Language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <div
          className={clsx(
            styles.codeBlockContainer,
            blockClassName,
            {
              [`language-${language}`]:
                language && !blockClassName.includes(`language-${language}`),
            },
            ThemeClassNames.common.codeBlock,
          )}>
          {codeBlockTitle && (
            <div style={style} className={styles.codeBlockTitle}>
              {codeBlockTitle}
            </div>
          )}
          <div
            className={clsx(styles.codeBlockContent, language)}
            style={style}>
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar')}>
              <code className={styles.codeBlockLines}>
                {tokens.map((line, i) => {
                  if (line.length === 1 && line[0]!.content === '\n') {
                    line[0]!.content = '';
                  }

                  const lineProps = getLineProps({line, key: i});

                  if (highlightLines.includes(i)) {
                    lineProps.className += ' docusaurus-highlight-code-line';
                  }

                  return (
                    <span key={i} {...lineProps}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({token, key})} />
                      ))}
                      <br />
                    </span>
                  );
                })}
              </code>
            </pre>

            <button
              type="button"
              aria-label={
                isCopied
                  ? translate({
                      id: 'theme.CodeBlock.copied',
                      message: 'Copied',
                      description: 'The copied button label on code blocks',
                    })
                  : translate({
                      id: 'theme.CodeBlock.copyButtonAriaLabel',
                      message: 'Copy code to clipboard',
                      description: 'The ARIA label for copy code blocks button',
                    })
              }
              className={clsx(
                styles.copyButton,
                'clean-btn',
                isCopied && styles.copyButtonCopied,
              )}
              onClick={handleCopyCode}>
              <span className={styles.copyButtonIcons}>
                <svg
                  className={styles.copyButtonIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                </svg>

                <svg
                  className={styles.copyButtonSuccessIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}
    </Highlight>
  );
}
