// librarySystem; one global variable
// 1. Create: librarySystem('libraryName', [dependencies], function(...arrayOfDependencies) {/* return library */ });
// 2. Use: librarySystem('libraryName')

(function(root, undefined) {
  'use strict';
  const libraryStorage = {};
  
  function librarySystem(libraryName, dependencies, callback) {
    // create library
    if (arguments.length > 1) {
      let availableDependencies = [];
      let missingDependencies = [];

      if (!Array.isArray(dependencies)) {
        throw new TypeError(`${dependencies} is not an array.`);
      }
      else if (dependencies.length > 0){
        // arrange so dependencies are available to callback by their names
        dependencies.forEach(function(dependency) {
          if (dependency in libraryStorage) {
            availableDependencies.push(libraryStorage[dependency]);
          }
          else {
            missingDependencies.push(dependency);
          }
        });
      }

      if (dependencies.length === availableDependencies.length) {
        libraryStorage[libraryName] = callback(...availableDependencies);
      }
      else {
        throw new Error(`Library not created, lacks ${missingDependencies.length} dependencies: ${missingDependencies.reduce((accum, dep) =>
                (accum + ', ' + dep))
          }.`);
      }
    
    // fetch library
    } else {
      if (!(libraryName in libraryStorage)) {
        throw new ReferenceError(`${libraryName} is not defined.`);
      }

      return libraryStorage[libraryName];
    }
  }
  root['librarySystem'] = librarySystem;

})(this);