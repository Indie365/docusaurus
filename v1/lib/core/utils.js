/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const shell = require('shelljs');

const execSync = require('child_process').execSync;

const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;

function blogPostHasTruncateMarker(content) {
  return TRUNCATE_MARKER.test(content);
}

function extractBlogPostBeforeTruncate(content) {
  return content.split(TRUNCATE_MARKER)[0];
}

function removeExtension(pathStr) {
  return pathStr.replace(/\.[^/.]+$/, '');
}

function getPath(pathStr, cleanUrl = false) {
  if (!pathStr || !cleanUrl || !pathStr.endsWith('.html')) {
    return pathStr;
  }
  return pathStr.endsWith('/index.html')
    ? pathStr.replace(/index\.html$/, '')
    : removeExtension(pathStr);
}

function idx(target, keyPaths) {
  return (
    target &&
    (Array.isArray(keyPaths)
      ? keyPaths.reduce((obj, key) => obj && obj[key], target)
      : target[keyPaths])
  );
}

function getGitLastUpdated(filepath) {
  function isTimestamp(str) {
    return /^\d+$/.test(str);
  }

  // Wrap in try/catch in case the shell commands fail (e.g. project doesn't use Git, etc).
  try {
    // To differentiate between content change and file renaming / moving, use --summary
    // To follow the file history until before it is moved (when we create new version), use
    // --follow.
    const silentState = shell.config.silent; // Save old silent state.
    shell.config.silent = true;
    const result = shell
      .exec(`git log --follow --summary --format=%ct ${filepath}`)
      .stdout.trim();
    shell.config.silent = silentState;

    // Format the log results to be
    // ['1234567', 'rename ...', '1234566', 'move ...', '1234565', '1234564']
    const records = result
      .toString('utf-8')
      .replace(/\n\s*\n/g, '\n')
      .split('\n')
      .filter(String);

    const timeSpan = records.find((item, index, arr) => {
      const currentItemIsTimestamp = isTimestamp(item);
      const isLastTwoItem = index + 2 >= arr.length;
      const nextItemIsTimestamp = isTimestamp(arr[index + 1]);
      return currentItemIsTimestamp && (isLastTwoItem || nextItemIsTimestamp);
    });

    if (timeSpan) {
      const date = new Date(parseInt(timeSpan, 10) * 1000);
      return date.toLocaleString();
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

function getGitLastUpdatedBy(filepath) {
  function isAuthor(str) {
    return str.startsWith('author=');
  }
  // Wrap in try/catch in case the shell commands fail (e.g. project doesn't use Git, etc).
  try {
    const silentState = shell.config.silent; // save old silent state
    shell.config.silent = true;
    const result = shell
      .exec(`git log --follow --summary --format=author=%an ${filepath}`)
      .stdout.trim();
    shell.config.silent = silentState;
    // Format the log results to be ['1234567', 'rename ...', '1234566', 'move ...', '1234565', '1234564']
    const records = result
      .toString('utf-8')
      .replace(/\n\s*\n/g, '\n')
      .split('\n')
      .filter(String);
    const lastContentModifierAuthor = records.find((item, index, arr) => {
      const currentItemIsAuthor = isAuthor(item);
      const isLastTwoItem = index + 2 >= arr.length;
      const nextItemIsAuthor = isAuthor(arr[index + 1]);
      return currentItemIsAuthor && (isLastTwoItem || nextItemIsAuthor);
    });
    if (lastContentModifierAuthor) {
      return lastContentModifierAuthor.slice(7);
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

function getAuthorInformation(filepath) {
  /* set metadata author */
  const authorRegex = /(\d+) author (.+)$/g;
  const results = execSync(
    `git blame --line-porcelain ${filepath} \
    | grep -I "^author " | sort | uniq -c | sort -nr; \
  `,
  )
    .toString()
    .split('\n');

  const authors = [];
  let totalLineCount = 0;

  /* handle case where it's not github repo */
  if (results.length && results[0].length) {
    let authorData;
    results.forEach(result => {
      if ((authorData = authorRegex.exec(result)) !== null) {
        const lineCount = parseInt(authorData[1], 10);
        const name = authorData[2];
        authors.push({
          lineCount,
          name,
        });
        totalLineCount += lineCount;
      }
      authorRegex.lastIndex = 0;
    });
  }
  return {authors, totalLineCount};
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  getGitLastUpdated,
  getAuthorInformation,
  getGitLastUpdatedBy,
  getPath,
  removeExtension,
  idx,
};
