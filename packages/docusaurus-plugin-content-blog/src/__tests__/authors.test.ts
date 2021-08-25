/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AuthorsMap,
  getAuthorsMapFilePath,
  validateAuthorsMapFile,
  readAuthorsMapFile,
  getAuthorsMap,
} from '../authors';
import path from 'path';

describe('readAuthorsMapFile', () => {
  const fixturesDir = path.join(__dirname, '__fixtures__/authorsMapFiles');

  test('read valid yml author file', async () => {
    const filePath = path.join(fixturesDir, 'authors.yml');
    expect(await readAuthorsMapFile(filePath)).toBeDefined();
  });

  test('read valid json author file', async () => {
    const filePath = path.join(fixturesDir, 'authors.json');
    expect(await readAuthorsMapFile(filePath)).toBeDefined();
  });

  test('read yml and json should lead to the same result', async () => {
    const content1 = await readAuthorsMapFile(
      path.join(fixturesDir, 'authors.yml'),
    );
    const content2 = await readAuthorsMapFile(
      path.join(fixturesDir, 'authors.json'),
    );
    expect(content1).toEqual(content2);
  });

  test('fail to read invalid yml 1', async () => {
    const filePath = path.join(fixturesDir, 'authorsBad1.yml');
    await expect(
      readAuthorsMapFile(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"\\"slorber.name\\" is required"`,
    );
  });
  test('fail to read invalid json 1', async () => {
    const filePath = path.join(fixturesDir, 'authorsBad1.json');
    await expect(
      readAuthorsMapFile(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"\\"slorber.name\\" is required"`,
    );
  });

  test('fail to read invalid yml 2', async () => {
    const filePath = path.join(fixturesDir, 'authorsBad2.yml');
    await expect(
      readAuthorsMapFile(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"\\"name\\" must be of type object"`,
    );
  });
  test('fail to read invalid json 2', async () => {
    const filePath = path.join(fixturesDir, 'authorsBad2.json');
    await expect(
      readAuthorsMapFile(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"\\"name\\" must be of type object"`,
    );
  });

  test('fail to read invalid yml 3', async () => {
    const filePath = path.join(fixturesDir, 'authorsBad3.yml');
    await expect(
      readAuthorsMapFile(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
  });
  test('fail to read invalid json 3', async () => {
    const filePath = path.join(fixturesDir, 'authorsBad3.json');
    await expect(
      readAuthorsMapFile(filePath),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
  });
});
describe('getAuthorsMap', () => {
  const fixturesDir = path.join(__dirname, '__fixtures__/authorsMapFiles');
  const contentPaths = {
    contentPathLocalized: fixturesDir,
    contentPath: fixturesDir,
  };

  test('getAuthorsMap can read yml file', async () => {
    expect(
      await getAuthorsMap({
        contentPaths,
        authorsMapPath: 'authors.yml',
      }),
    ).toBeDefined();
  });

  test('getAuthorsMap can read json file', async () => {
    expect(
      await getAuthorsMap({
        contentPaths,
        authorsMapPath: 'authors.json',
      }),
    ).toBeDefined();
  });

  test('getAuthorsMap can return undefined if yaml file not found', async () => {
    expect(
      await getAuthorsMap({
        contentPaths,
        authorsMapPath: 'authors_does_not_exist.yml',
      }),
    ).toBeUndefined();
  });
});

describe('validateAuthorsMapFile', () => {
  test('accept valid authors map', () => {
    const authorsMap: AuthorsMap = {
      slorber: {
        name: 'Sébastien Lorber',
        title: 'maintainer',
        url: 'https://sebastienlorber.com',
        imageURL: 'https://github.com/slorber.png',
      },
      yangshun: {
        name: 'Yangshun Tay',
        imageURL: 'https://github.com/yangshun.png',
        randomField: 42,
      },
      jmarcey: {
        name: 'Joel',
        title: 'creator of Docusaurus',
        hello: new Date(),
      },
    };
    expect(validateAuthorsMapFile(authorsMap)).toEqual(authorsMap);
  });

  test('rename snake case image_url to camelCase imageURL', () => {
    const authorsMap: AuthorsMap = {
      slorber: {
        name: 'Sébastien Lorber',
        image_url: 'https://github.com/slorber.png',
      },
    };
    expect(validateAuthorsMapFile(authorsMap)).toEqual({
      slorber: {
        name: 'Sébastien Lorber',
        imageURL: 'https://github.com/slorber.png',
      },
    });
  });

  test('reject author without name', () => {
    const authorsMap: AuthorsMap = {
      slorber: {
        image_url: 'https://github.com/slorber.png',
      },
    };
    expect(() =>
      validateAuthorsMapFile(authorsMap),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"slorber.name\\" is required"`);
  });

  test('reject undefined author', () => {
    expect(() =>
      validateAuthorsMapFile({
        slorber: undefined,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"slorber\\" is required"`);
  });

  test('reject null author', () => {
    expect(() =>
      validateAuthorsMapFile({
        slorber: null,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"slorber\\" must be of type object"`,
    );
  });

  test('reject array author', () => {
    expect(() =>
      validateAuthorsMapFile({slorber: []}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"slorber\\" must be of type object"`,
    );
  });

  test('reject array content', () => {
    expect(() => validateAuthorsMapFile([])).toThrowErrorMatchingInlineSnapshot(
      // TODO improve this error message
      `"\\"value\\" must be of type object"`,
    );
  });

  test('reject flat author', () => {
    expect(() =>
      validateAuthorsMapFile({name: 'Sébastien'}),
    ).toThrowErrorMatchingInlineSnapshot(
      // TODO improve this error message
      `"\\"name\\" must be of type object"`,
    );
  });

  test('reject non-map author', () => {
    const authorsMap: AuthorsMap = {
      // @ts-expect-error: for tests
      slorber: [],
    };
    expect(() =>
      validateAuthorsMapFile(authorsMap),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"slorber\\" must be of type object"`,
    );
  });
});

describe('getAuthorsMapFilePath', () => {
  const fixturesDir = path.join(
    __dirname,
    '__fixtures__/getAuthorsMapFilePath',
  );
  const contentPathYml1 = path.join(fixturesDir, 'contentPathYml1');
  const contentPathYml2 = path.join(fixturesDir, 'contentPathYml2');
  const contentPathJson1 = path.join(fixturesDir, 'contentPathJson1');
  const contentPathJson2 = path.join(fixturesDir, 'contentPathJson2');
  const contentPathEmpty = path.join(fixturesDir, 'contentPathEmpty');
  const contentPathNestedYml = path.join(fixturesDir, 'contentPathNestedYml');

  test('getAuthorsMapFilePath returns localized Yml path in priority', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml1,
          contentPath: contentPathYml2,
        },
      }),
    ).toEqual(path.join(contentPathYml1, 'authors.yml'));
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml2,
          contentPath: contentPathYml1,
        },
      }),
    ).toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  test('getAuthorsMapFilePath returns localized Json path in priority', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson1,
          contentPath: contentPathJson2,
        },
      }),
    ).toEqual(path.join(contentPathJson1, 'authors.json'));
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson2,
          contentPath: contentPathJson1,
        },
      }),
    ).toEqual(path.join(contentPathJson2, 'authors.json'));
  });

  test('getAuthorsMapFilePath returns unlocalized Yml path as fallback', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml2,
        },
      }),
    ).toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  test('getAuthorsMapFilePath returns unlocalized Json path as fallback', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).toEqual(path.join(contentPathJson1, 'authors.json'));
  });

  test('getAuthorsMapFilePath can return undefined (file not found)', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml1,
        },
      }),
    ).toBeUndefined();
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).toBeUndefined();
  });

  test('getAuthorsMapFilePath can return nested path', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'sub/folder/authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathNestedYml,
        },
      }),
    ).toEqual(path.join(contentPathNestedYml, 'sub/folder/authors.yml'));
  });
});
