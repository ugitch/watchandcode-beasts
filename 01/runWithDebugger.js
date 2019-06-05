// using spread operator
function runWithDebugger(callback, argsForCallback) {
  debugger;
  if (Array.isArray(argsForCallback)) {
    return callback(...argsForCallback);
  } else if (argsForCallback !== undefined) {
    return callback(argsForCallback);
  } else {
    return callback();
  }
}

