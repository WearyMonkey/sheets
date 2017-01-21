const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const fs = require('fs');
const flowBin = require('flow-bin');
const spawnSync = require('child_process').spawnSync;
const rimraf = require('rimraf');

module.exports = class FlowWebpackPlugin {

  /**
   * @param {{
   *  cachePath: string,
   *  srcPath: string
   * }} opts
   */
  constructor(opts) {
    const cachePath = opts.cachePath || os.tmpdir();

    /**
     * @private
     * @const
     * @type {string}
     */
    this.storePath = path.join(cachePath, 'store');

    /**
     * @private
     * @const
     * @type {string}
     */
    this.stagePath = path.join(cachePath, 'stage');

    /**
     * @private
     * @const
     * @type {string}
     */
    this.srcPath = opts.srcPath;

    /**
     * @private
     * @type {boolean}
     */
    this.first = true;
  }

  /**
   * @param {{
   *  prependFlow: boolean|null|undefined
   * }|undefined} opts
   * @returns {string}
   */
  loader(opts = {}) {
    return `${require.resolve('./loader')}?store=${encodeURIComponent(this.storePath)}&src=${encodeURIComponent(this.srcPath)}&prependFlow=${!!opts.prependFlow}`;
  }

  apply(compiler) {
    const projectFiles = ['.flowconfig', 'node_modules', 'flow-typed', 'package.json'];
    compiler.plugin("emit", (compilation, callback) => {
      rimraf(`${this.stagePath}/!(${projectFiles.join('|')})`, { glob: { dot: true } }, () => {
        mkdirp.sync(this.stagePath);

        projectFiles.forEach(pathToLn => {
          const absolutePath = path.join(this.srcPath, pathToLn);
          const targetPath = path.join(this.stagePath, pathToLn);
          if (fs.existsSync(absolutePath) && !fs.existsSync(targetPath)) {
            fs.symlinkSync(absolutePath, targetPath);
          }
        });

        compilation.modules.forEach(({ resource, reasons }) => {
          if (resource && resource.startsWith(this.srcPath)) {
            const relativePath = resource.slice(this.srcPath.length);
            const source = path.join(this.storePath, relativePath);
            if (fs.existsSync(source)) {
              reasons.forEach(reason => {
                const request = reason.dependency.request;
                const fileName = path.basename(request, '.js') + '.js';
                const target = path.join(this.stagePath, path.dirname(relativePath), fileName);
                if (!fs.existsSync(target)) {
                  mkdirp.sync(path.dirname(target));
                  fs.linkSync(source, target);
                }
              });
            }
          }
        });

        this.exec(['status']);
        this.maybePrepareCleanup();
        callback();
      });
    });
  }

  maybePrepareCleanup() {
    if (this.first == true) {
      this.first = false;
      process.on('exit', () => this.exec(['stop']));
      process.on('SIGINT', () => this.exec(['stop']));
    }
  }

  exec(args) {
    spawnSync(flowBin, args, {cwd: this.stagePath, stdio: 'inherit'});
  }
};