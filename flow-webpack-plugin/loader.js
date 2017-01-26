const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
const mkdirp = require('mkdirp');

module.exports = function(source) {
  this.cacheable();
  const { store, src } = loaderUtils.parseQuery(this.query);
  let resourcePath = path.join(store, path.relative(src, this.resourcePath));

  if (!fs.existsSync(resourcePath) || checkModifiedTime(this.resourcePath, resourcePath)) {
    mkdirp.sync(path.dirname(resourcePath));
    fs.writeFileSync(resourcePath, source, 'UTF8');
  }

  return source;
};

function checkModifiedTime(source, target) {
  const sourceMTime = fs.statSync(source).mtime;
  const targetMTime = fs.statSync(target).mtime;
  return sourceMTime > targetMTime;
}