/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from 'sharp';
import fs from 'fs/promises';

const images = await fs.readdir(
  new URL('../../website/src/data/showcase', import.meta.url),
);

await Promise.all(
  images.map(async (img) => {
    const imgPath = new URL(
      `../../website/src/data/showcase/${img}`,
      import.meta.url,
    ).pathname;
    const data = await sharp(imgPath).resize(640).png().toBuffer();
    await fs.writeFile(imgPath.replace(/jpe?g/, 'png'), data);
  }),
);
