module.exports = function(content) {
  return content.replace(/module\.exports = exports\['default'];/g, '// $0')
};