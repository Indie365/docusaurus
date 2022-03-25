/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useState, useCallback} from 'react';
import renderRoutes from '@docusaurus/renderRoutes';
import type {
  PropSidebar,
  PropVersionMetadata,
} from '@docusaurus/plugin-content-docs';
import Layout from '@theme/Layout';
import DocSidebar from '@theme/DocSidebar';
import NotFound from '@theme/NotFound';
import type {DocumentRoute} from '@theme/DocItem';
import type {Props} from '@theme/DocPage';
import IconArrow from '@theme/IconArrow';
import BackToTopButton from '@theme/BackToTopButton';
import {matchPath} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';

import clsx from 'clsx';
import styles from './styles.module.css';

import {
  HtmlClassNameProvider,
  ThemeClassNames,
  docVersionSearchTag,
  DocsSidebarProvider,
  useDocsSidebar,
  DocsVersionProvider,
} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';

type DocPageContentProps = {
  readonly currentDocRoute: DocumentRoute;
  readonly versionMetadata: PropVersionMetadata;
  readonly children: ReactNode;
  readonly sidebarName: string | undefined;
};

function SidebarExpandButton({toggleSidebar}: {toggleSidebar: () => void}) {
  return (
    <div
      className={styles.collapsedDocSidebar}
      title={translate({
        id: 'theme.docs.sidebar.expandButtonTitle',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.expandButtonAriaLabel',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      tabIndex={0}
      role="button"
      onKeyDown={toggleSidebar}
      onClick={toggleSidebar}>
      <IconArrow className={styles.expandSidebarButtonIcon} />
    </div>
  );
}

type DocPageAsideProps = Pick<
  DocPageContentProps,
  'currentDocRoute' | 'sidebarName'
> & {
  hiddenSidebarContainer: boolean;
  setHiddenSidebarContainer: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: PropSidebar;
};

function DocPageAside({
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
  currentDocRoute,
  sidebarName,
  sidebar,
}: DocPageAsideProps): JSX.Element {
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
      )}
      onTransitionEnd={(e) => {
        if (!e.currentTarget.classList.contains(styles.docSidebarContainer!)) {
          return;
        }

        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
      <DocSidebar
        key={
          // Reset sidebar state on sidebar changes
          // See https://github.com/facebook/docusaurus/issues/3414
          sidebarName
        }
        sidebar={sidebar}
        path={currentDocRoute.path}
        onCollapse={toggleSidebar}
        isHidden={hiddenSidebar}
      />

      {hiddenSidebar && <SidebarExpandButton toggleSidebar={toggleSidebar} />}
    </aside>
  );
}

type DocPageMainProps = {
  sidebar: PropSidebar | null;
  hiddenSidebarContainer: boolean;
  children: ReactNode;
};

function DocPageMain({
  hiddenSidebarContainer,
  sidebar,
  children,
}: DocPageMainProps) {
  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
      </div>
    </main>
  );
}

function DocPageContent({
  currentDocRoute,
  versionMetadata,
  children,
  sidebarName,
}: DocPageContentProps): JSX.Element {
  const sidebar = useDocsSidebar();
  const {pluginId, version} = versionMetadata;
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  return (
    <>
      <SearchMetadata
        version={version}
        tag={docVersionSearchTag(pluginId, version)}
      />
      <Layout>
        <div className={styles.docPage}>
          <BackToTopButton />
          {sidebar && (
            <DocPageAside
              currentDocRoute={currentDocRoute}
              sidebarName={sidebarName}
              sidebar={sidebar}
              hiddenSidebarContainer={hiddenSidebarContainer}
              setHiddenSidebarContainer={setHiddenSidebarContainer}
            />
          )}
          <DocPageMain
            sidebar={sidebar}
            hiddenSidebarContainer={hiddenSidebarContainer}>
            {children}
          </DocPageMain>
        </div>
      </Layout>
    </>
  );
}

export default function DocPage(props: Props): JSX.Element {
  const {
    route: {routes: docRoutes},
    versionMetadata,
    location,
  } = props;
  const currentDocRoute = docRoutes.find((docRoute) =>
    matchPath(location.pathname, docRoute),
  );
  if (!currentDocRoute) {
    return <NotFound />;
  }

  // For now, the sidebarName is added as route config: not ideal!
  const sidebarName = currentDocRoute.sidebar;

  const sidebar = sidebarName
    ? versionMetadata.docsSidebars[sidebarName]
    : null;

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.docsPages,
        ThemeClassNames.page.docsDocPage,
        versionMetadata.className,
      )}>
      <DocsVersionProvider version={versionMetadata}>
        <DocsSidebarProvider sidebar={sidebar ?? null}>
          <DocPageContent
            currentDocRoute={currentDocRoute}
            versionMetadata={versionMetadata}
            sidebarName={sidebarName}>
            {renderRoutes(docRoutes, {versionMetadata})}
          </DocPageContent>
        </DocsSidebarProvider>
      </DocsVersionProvider>
    </HtmlClassNameProvider>
  );
}
