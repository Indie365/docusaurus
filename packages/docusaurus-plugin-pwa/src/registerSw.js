/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

async function clearRegistrations() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  registrations.forEach((registration) => {
    registration.unregister();
  });

  window.location.reload();
}

const MAX_MOBILE_WIDTH = 940;
const APP_INSTALLED_KEY = 'docusaurus.pwa.appInstalled';

(async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if ('serviceWorker' in navigator) {
    const {Workbox} = await import('workbox-window');

    const shouldCacheFiles =
      window.innerWidth <= MAX_MOBILE_WIDTH ||
      (navigator.connection && navigator.connection.saveData) ||
      localStorage.getItem(APP_INSTALLED_KEY) ||
      window.location.search.includes('offline');

    const enabledParam = shouldCacheFiles ? `?enabled` : '';
    const swUrl = `${process.env.SERVICE_WORKER}${enabledParam}`;
    const wb = new Workbox(swUrl);
    const registration = await wb.register();

    const handleServiceWorkerWaiting = async () => {
      // Immediately load new service worker when files aren't cached
      if (!shouldCacheFiles) {
        wb.messageSW({type: 'SKIP_WAITING'});
      } else if (process.env.PWA_POPUP) {
        const renderPopup = (await import('./renderPopup')).default;

        renderPopup({
          onRefresh() {
            wb.addEventListener('controlling', () => {
              window.location.reload();
            });

            wb.messageSW({type: 'SKIP_WAITING'});
          },
        });
      }
    };

    // Update service worker if the next one is already in the waiting state.
    // This happens when the user doesn't doesn't click on `Refresh` in the
    // popup.
    if (registration.waiting) {
      handleServiceWorkerWaiting();
    }

    // Update the current service worker when the next one has finished
    // installing and transitions to waiting state.
    wb.addEventListener('waiting', handleServiceWorkerWaiting);

    // Update current service worker if the next one finishes installing and
    // moves to waiting state in another tab.
    wb.addEventListener('externalwaiting', handleServiceWorkerWaiting);

    window.addEventListener('appinstalled', () => {
      localStorage.setItem(APP_INSTALLED_KEY, true);
      clearRegistrations();
    });

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();

      if (localStorage.getItem(APP_INSTALLED_KEY)) {
        localStorage.removeItem(APP_INSTALLED_KEY);
        clearRegistrations();
      }
    });
  }
})();
