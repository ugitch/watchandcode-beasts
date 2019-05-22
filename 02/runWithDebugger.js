// using spread operator
function runWithDebugger(callback, options) {
  debugger;
  if (options !== undefined && Array.isArray(options)) {
    return callback(...options);
  } else {
    return callback();
  }
}

