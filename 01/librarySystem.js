// librarySystem; one global variable
// 1. Create: librarySystem('libraryName', [dependencies], function(...arrayOfDependencies) {/* return library */ });
// 2. Use: librarySystem('libraryName')

(function(root, undefined) {
  'use strict';
  const libraryStorage = {};
  
  function librarySystem(libraryName, dependencies, callback) {
    // create library
    // recursive case
    if (arguments.length > 1) {
      let dependencyModules = [];
      let dependencyLacking = [];

      // if not an array, throw TypeError
      if (!Array.isArray(dependencies)) {
        throw new TypeError(`${dependencies} is not an array.`);
      }
      // check if any dependencies
      else if (dependencies.length > 0){
        // arrange so dependencies are available to callback by their names
        dependencies.forEach(function(dependency) {
          if (dependency in libraryStorage) {
            dependencyModules.push(librarySystem(dependency));
          }
          else {
            dependencyLacking.push(dependency);
          }
        });
      }

      // if all the dependencies are available, run the callback
      if (dependencies.length === dependencyModules.length) {
        libraryStorage[libraryName] = callback(...dependencyModules);
      }
      // throw an error with information about missing dependencies
      else {
        throw new Error(`Library not loaded, lacks ${dependencyLacking.length} dependencies: ${dependencyLacking}.`);
      }
    
    // base case
    // fetch library
    } else {
      // throw an error if no library found
      if (!(libraryName in libraryStorage)) {
        throw new ReferenceError(`${libraryName} is not defined.`);
      }

      return libraryStorage[libraryName];
    }
  }
  // librarySystem function is available in global scope
  root['librarySystem'] = librarySystem;

})(this);