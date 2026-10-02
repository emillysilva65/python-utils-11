const safeStringify = (val, seen = new WeakSet()) => {
  if (val === null || val === undefined) return val;
  if (typeof val === 'bigint') return `${val.toString()}n`;
  if (typeof val === 'object') {
    if (seen.has(val)) return '[Circular]';
    seen.add(val);
    if (Array.isArray(val)) {
      return val.map(item => safeStringify(item, seen));
    }
    if (val instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(val))) {
      return `0x${Array.from(val).map(b => b.toString(16).padStart(2, '0')).join('')}`;
    }
    const safeObj = {};
    for (const [k, v] of Object.entries(val)) {
      try {
        safeObj[k] = safeStringify(v, seen);
      } catch (e) {
        safeObj[k] = `[unserializable: ${e.message}]`;
      }
    }
    return safeObj;
  }
  return val;
};

class ExceptionSafeCryptoLogger {
  constructor(prefix = 'crypto-utils') {
    this.prefix = prefix;
  }

  log(level, ...args) {
    try {
      const sanitized = args.map(arg => {
        try {
          return typeof arg === 'object' ? safeStringify(arg) : arg;
        } catch (e) {
          return `[recovery-fallback: ${e.message}]`;
        }
      });
      const timestamp = new Date().toISOString();
      const print = console[level] || console.log;
      print(`[${timestamp}] [${this.prefix.toUpperCase()}] [${level.toUpperCase()}]:`, ...sanitized);
    } catch (criticalErr) {
      try {
        process.stderr.write(`logger collapse: ${criticalErr.message}\n`);
      } catch (sysErr) {
        // absolute last resort silence
      }
    }
  }

  info(...args) { this.log('info', ...args); }
  warn(...args) { this.log('warn', ...args); }
  error(...args) { this.log('error', ...args); }
}

module.exports = new ExceptionSafeCryptoLogger();