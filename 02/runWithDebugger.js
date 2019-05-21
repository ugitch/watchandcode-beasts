// using spread operator
function runWithDebugger(callback, options) {
  debugger;
  if (options !== undefined && Array.isArray(options)) {
    callback(...options);
  } else {
    callback();
  }
}

