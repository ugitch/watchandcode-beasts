// using spread operator
function runWithDebugger(callback, options) {
  debugger;
  if (options !== undefined) {
    callback(...options);
  }
}

// using arguments variable
function runWithDebugger(callback) {
  debugger;
  if (arguments.length === 2) {
    callback.apply(null, arguments[1]);
  }
}

