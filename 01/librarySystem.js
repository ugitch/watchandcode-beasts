// librarySystem; one global variable
// 1. Create: librarySystem('libraryName', function() {/* return library */ });
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
      // map dependencies into their values
      let dependenciesValues = dependencies.map(function(dependency) {
        return libraryStorage[dependency];
      });

      libraryStorage[libraryName] = callback(...dependenciesValues);
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