/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Joi from '../Joi';
import {JoiFrontMatter, validateFrontMatter} from '../validationUtils';

describe('validateFrontMatter', () => {
  test('should accept good values', () => {
    const schema = Joi.object<{test: string}>({
      test: Joi.string(),
    });
    const frontMatter = {
      test: 'hello',
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual(frontMatter);
  });

  test('should reject bad values', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const schema = Joi.object<{test: string}>({
      test: Joi.string(),
    });
    const frontMatter = {
      test: true,
    };
    expect(() =>
      validateFrontMatter(frontMatter, schema),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"test\\" must be a string"`);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('FrontMatter contains invalid values: '),
    );
  });

  test('should convert values', () => {
    const schema = Joi.object<{test: string}>({
      test: JoiFrontMatter.string(),
    });
    const frontMatter = {
      test: 42,
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual({test: '42'});
  });
});
