/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect} from 'react';
import Perimeter from 'react-perimeter';
import {NavLink} from 'react-router-dom';

const internalRegex = /^\/(?!\/)/;

function Link(props) {
  const {to, href, preloadProximity = 20} = props;
  const targetLink = to || href;
  const isInternal = internalRegex.test(targetLink);

  const IOSupported =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;

  let io;
  const handleIntersection = (el, cb) => {
    io = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (el === entry.target) {
          // If element is in viewport, stop listening/observing & run callback.
          // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            io.unobserve(el);
            io.disconnect();
            cb();
          }
        }
      });
    });
    // Add element to the observer
    io.observe(el);
  };

  const handleRef = ref => {
    if (IOSupported && ref && isInternal) {
      // If IO supported and element reference found, setup Observer functionality
      handleIntersection(ref, () => {
        window.__docusaurus.prefetch(targetLink);
      });
    }
  };

  useEffect(() => {
    // If IO is not supported. We prefetch by default (only once)
    if (!IOSupported && isInternal) {
      window.__docusaurus.prefetch(targetLink);
    }
    // when unmount, stops intersection observer from watching
    return () => {
      if (IOSupported && io) {
        io.disconnect();
      }
    };
  }, [targetLink, IOSupported, isInternal]);

  return !targetLink || !isInternal ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} href={targetLink} />
  ) : (
    <Perimeter
      padding={preloadProximity}
      onBreach={() => window.__docusaurus.preload(targetLink)}
      once>
      <NavLink {...props} innerRef={handleRef} to={targetLink} />
    </Perimeter>
  );
}

export default Link;
