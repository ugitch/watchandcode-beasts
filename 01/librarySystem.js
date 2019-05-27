// librarySystem; one global variable
// 1. Create: librarySystem('libraryName', [dependencies], function(...arrayOfDependencies) {/* return library */ });
// 2. Use: librarySystem('libraryName')

(function() {
  'use strict';
  const libraryStorage = {};
  
  function librarySystem(libraryName, dependencies, callback) {
    // creating a library
    if (arguments.length > 1) {
      let libraryDependencies = dependencies.map(function (dependency) {
        return libraryStorage[dependency];
      });
        
      libraryStorage[libraryName] = callback(...libraryDependencies);
    // using library
    } else {
      return libraryStorage[libraryName];
    }
  }
  // librarySystem function is available in global scope
  window.librarySystem = librarySystem;

})();

librarySystem('name', [], function() {
  return 'Gordon';
});

librarySystem('company', [], function() {
  return 'Watch and Code';
});

librarySystem('workBlurb', ['name', 'company'], function(name, company) {
  return name + ' works at ' + company;
});

librarySystem('workBlurb'); // 'Gordon works at Watch and Code'