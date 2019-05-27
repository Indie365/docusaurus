/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';

import SearchBar from '@theme/SearchBar';
import useTheme from '../Theme/useTheme';
import './styles.css';

function NavLink(props) {
  return (
    <Link
      className="navbar__link"
      {...props}
      {...(props.href
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: props.href,
          }
        : {
            activeClassName: 'navbar__link--active',
            to: withBaseUrl(props.to),
          })}>
      {props.label}
    </Link>
  );
}

function Navbar() {
  const context = useDocusaurusContext();
  const {toggleDarkMode} = useTheme();
  const {siteConfig = {}} = context;
  const {baseUrl, themeConfig = {}} = siteConfig;
  const {algolia, navbar = {}} = themeConfig;
  const {title, logo, links = []} = navbar;

  return (
    <nav className="navbar navbar--light navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to={baseUrl}>
            {logo != null && (
              <img
                className="navbar__logo"
                src={withBaseUrl(logo.src)}
                alt={logo.alt}
              />
            )}
            {title != null && <strong>{title}</strong>}
          </Link>
          {links
            .filter(linkItem => linkItem.position !== 'right')
            .map((linkItem, i) => (
              <div className="navbar__item" key={i}>
                <NavLink {...linkItem} />
              </div>
            ))}
        </div>
        <div className="navbar__items navbar__items--right">
          <label
            htmlFor="dark-mode"
            className="dark-mode"
            aria-label="Toggle light / dark mode.">
            <input type="checkbox" id="dark-mode" onChange={toggleDarkMode} />
            <span className="sun" role="img" aria-label="light-mode">
              🌞
            </span>
            <span className="moon" role="img" aria-label="dark-mode">
              🌛
            </span>
          </label>
          {links
            .filter(linkItem => linkItem.position === 'right')
            .map((linkItem, i) => (
              <div className="navbar__item" key={i}>
                <NavLink {...linkItem} />
              </div>
            ))}
          {algolia && (
            <div className="navbar__search" key="search-box">
              <SearchBar />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
