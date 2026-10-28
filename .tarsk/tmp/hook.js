const cp = require('child_process');
const log = (...a) => process._rawDebug('[spawn]', ...a);
for (const name of ['spawn', 'spawnSync', 'exec', 'execFile', 'execSync', 'execFileSync']) {
  const orig = cp[name];
  cp[name] = function (cmd, args, ...rest) {
    log(name, cmd, Array.isArray(args) ? args.join(' ') : args);
    const start = Date.now();
    const cbIndex = rest.findIndex((x) => typeof x === 'function');
    if (cbIndex >= 0) {
      const cb = rest[cbIndex];
      rest[cbIndex] = function (...r) {
        log('done', name, cmd, Date.now() - start + 'ms');
        return cb.apply(this, r);
      };
    }
    try {
      return orig.call(this, cmd, args, ...rest);
    } catch (e) {
      log('throw', name, cmd, e.message);
      throw e;
    }
  };
}
