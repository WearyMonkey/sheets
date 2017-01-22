const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
const mkdirp = require('mkdirp');

module.exports = function(source) {
  this.cacheable();
  const { store, src, prependFlow, stripAbsoluteImports } = loaderUtils.parseQuery(this.query);
  let resourcePath = path.join(store, path.relative(src, this.resourcePath));
  let flowSource = source;

  if (prependFlow) {
    flowSource = '// @flow\n' + flowSource;
  }

  if (!fs.existsSync(resourcePath) || checkModifiedTime(this.resourcePath, resourcePath)) {
    mkdirp.sync(path.dirname(resourcePath));
    fs.writeFileSync(resourcePath, flowSource, 'UTF8');
  }

  if (stripAbsoluteImports) {
    source = source.replace(/(import(\s+.*?from)?\s+['"])\//g, '$1');
  }

  return source;
};

function checkModifiedTime(source, target) {
  const sourceMTime = fs.statSync(source).mtime;
  const targetMTime = fs.statSync(target).mtime;
  return sourceMTime > targetMTime;
}