/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {type BaseUrlOptions, useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  makeImageStructuredData,
  makePersonStructuredData,
} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogListPage/StructuredData';
import StructuredData from '@theme/StructuredData';
import type {Author} from '@docusaurus/plugin-content-blog';
import type {Blog, WithContext} from 'schema-dts';

function getAuthor(authors: Author[]) {
  const authorsStructuredData = authors.map(makePersonStructuredData);
  return {
    author:
      authorsStructuredData.length === 1
        ? authorsStructuredData[0]
        : authorsStructuredData,
  };
}

function getImage(
  image: string | undefined,
  withBaseUrl: (url: string, options?: BaseUrlOptions | undefined) => string,
  title: string,
) {
  return image
    ? {
        image: makeImageStructuredData({
          imageUrl: withBaseUrl(image, {absolute: true}),
          caption: `title image for the blog post: ${title}`,
        }),
      }
    : {};
}

export default function BlogListPageStructuredData(props: Props): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();

  const {
    metadata: {blogDescription, blogTitle, permalink},
  } = props;

  const url = `${siteConfig.url}${permalink}`;

  // details on structured data support: https://schema.org/Blog
  const blogStructuredData: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    mainEntityOfPage: url,
    headline: blogTitle,
    description: blogDescription,
    blogPost: props.items.map((blogItem) => {
      const {
        content: {assets, frontMatter, metadata},
      } = blogItem;
      const {date, title, description} = metadata;

      const image = assets.image ?? frontMatter.image;
      const keywords = frontMatter.keywords ?? [];

      const blogUrl = `${siteConfig.url}${metadata.permalink}`;

      return {
        '@type': 'BlogPosting',
        '@id': blogUrl,
        mainEntityOfPage: blogUrl,
        url: blogUrl,
        headline: title,
        name: title,
        description,
        datePublished: date,
        ...getAuthor(metadata.authors),
        ...getImage(image, withBaseUrl, title),
        ...(keywords ? {keywords} : {}),
      };
    }),
  };

  return <StructuredData structuredData={blogStructuredData} />;
}