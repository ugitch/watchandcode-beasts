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
      // check if any dependencies
      if (dependencies.length > 0){
        // make dependencies available to callback,
        dependencies.forEach(function(dependency) {
          if (dependency in libraryStorage) {
            dependencyModules.push(librarySystem(dependency));
          }
        });
      }

      // if all the dependencies are available, run the callback
      if (dependencies.length === dependencyModules.length) {
        libraryStorage[libraryName] = callback(...dependencyModules);
      }
    
    // base case
    // fetch library
    } else {
      return libraryStorage[libraryName];
    }
  }
  // librarySystem function is available in global scope
  root['librarySystem'] = librarySystem;

})(this);