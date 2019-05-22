// using spread operator
function runWithDebugger(callback, options) {
  debugger;
  if (Array.isArray(options)) {
    return callback(...options);
  } else if (options !== undefined) {
    return callback(options);
  } else {
    return callback();
  }
}

