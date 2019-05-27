// librarySystem; one global variable
// 1. Create: librarySystem('libraryName', [dependencies], function(...arrayOfDependencies) {/* return library */ });
// 2. Use: librarySystem('libraryName')

(function() {

  var libraryStorage = {};
  
  function librarySystem(libraryName, dependencies, callback) {
  //  check dependencies
    if (dependencies && dependencies.length > 0) {
      for (let i = 0 ; i < dependencies.length; i++) {
        if (!(libraryStorage[dependencies[i]])) {
          return;
        }
      }
    }

    // creating a library
    if (arguments.length > 1) {
      libraryStorage[libraryName] = callback(...dependencies);
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
  return librarySystem(name) + ' works at ' + librarySystem(company);
});

librarySystem('workBlurb'); // 'Gordon works at Watch and Code'