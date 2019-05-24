/*global jQuery, Handlebars, Router */
jQuery(function ($) {
  'use strict';

  Handlebars.registerHelper('eq', function (a, b, options) {
    if (a === b) return options.fn(this);
  });

  const ENTER_KEY = 13;
  const ESCAPE_KEY = 27;

  var util = {
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },
    pluralize: function (count, word) {
      return count === 1 ? word : word + 's';
    },
    store: function (namespace, data) {
      if (arguments.length > 1) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      } else {
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
      }
    }
	};

  var App = {
    init: function () {
      this.todos = util.store('todos-jquery');
      this.todoTemplate = Handlebars.compile($('#todo-template').html());
      this.footerTemplate = Handlebars.compile($('#footer-template').html());
      this.bindEvents();

      new Router({
        '/:filter': function (filter) {
          this.filter = filter;
          view.render();
        }.bind(this)
      }).init('/all');
    },
    bindEvents: function () {
      $('#new-todo').on('keyup', handlers.create);
      $('#toggle-all').on('change', handlers.toggleAll);
      $('#footer').on('click', '#clear-completed', handlers.destroyCompleted);
      $('#todo-list')
        .on('change', '.toggle', handlers.toggle)
        .on('dblclick', 'label', handlers.editingMode)
        .on('keyup', '.edit', handlers.editKeyup)
        .on('focusout', '.edit', handlers.editAction)
        .on('click', '.destroy', handlers.destroy);
    },
    // updating model and view
    //  1) saving data to localStorage
    //  2) view.render for display
    update: function() {
      view.render();
      util.store('todos-jquery', this.todos);
    },
  };

  var filters = {
    // methods filtering todos
    getActiveTodos: function () {      
      return App.todos.filter(function (todo) {
        return !todo.completed;
      });
    },
    getCompletedTodos: function () {
      return App.todos.filter(function (todo) {
        return todo.completed;
      });
    },
    getFilteredTodos: function () {
      if (App.filter === 'active') {
        return this.getActiveTodos();
      }

      if (App.filter === 'completed') {
        return this.getCompletedTodos();
      }

      return App.todos;
    },

    // in a way, also a filter, this time filtering single todo
    // extracting todo from todos by its 'id'
    // accepts an element from inside the `.item` div and
    // returns the corresponding index in the `todos` array
    indexFromEl: function (el) {
      var id = $(el).closest('li').data('id');
      var todos = App.todos;
      var i = todos.length;

      while (i--) {
        if (todos[i].id === id) {
          return i;
        }
      }
    }
  };

  // handler methods (controller)
  // all of them updating data and view
  var handlers = {
    toggle: function (e) {
      var i = filters.indexFromEl(e.target);
      App.todos[i].completed = !App.todos[i].completed;
      App.update();
    },
    toggleAll: function (e) {
      var isChecked = $(e.target).prop('checked');

      App.todos.forEach(function (todo) {
        todo.completed = isChecked;
      });

      App.update();    
    },
    destroy: function (e) {
      App.todos.splice(filters.indexFromEl(e.target), 1);
      App.update();
    },
    destroyCompleted: function () {
      App.todos = filters.getActiveTodos();
      App.update();
    },

    // creating TODO, including interludes between pressing keys for todo title
    create: function (e) {
      var $input = $(e.target);
      var val = $input.val().trim();

      if (e.which !== ENTER_KEY || !val) {
        return;
      }

      App.todos.push({
        id: util.uuid(),
        title: val,
        completed: false
      });

      $input.val('');

      App.update();
    },
    // editing methods with only one of them (editAction) updating data and view
    editingMode: function (e) {
      var $input = $(e.target).closest('li').addClass('editing').find('.edit');
      // puts caret(pointer) at end of input
      var tmpStr = $input.val();
      $input.val('');
      $input.val(tmpStr);
      $input.focus(); 
    },
    editKeyup: function (e) {
      if (e.which === ENTER_KEY) {
        e.target.blur();
        return;
      }

      if (e.which === ESCAPE_KEY) {
        $(e.target).data('abort', true).blur();
      }
    },
    // 3 possible outcomes: abort action, delete todo & update todo.title
    editAction: function (e) {
      var el = e.target;
      var $el = $(el);
      var val = $el.val().trim();

      if ($el.data('abort')) {
        $el.data('abort', false);
      } else if (!val) {
        handlers.destroy(e);
        return;
      } else {
        App.todos[filters.indexFromEl(el)].title = val;
      }

      App.update();
    }
  };

  // view object, displaying contents on the screen
  var view = {
    render: function () {
      var todos = filters.getFilteredTodos();
      $('#todo-list').html(App.todoTemplate(todos));
      $('#main').toggle(todos.length > 0);
      $('#toggle-all').prop('checked', filters.getActiveTodos().length === 0);
      this.renderFooter();
      $('#new-todo').focus();
    },
    renderFooter: function () {
      var todoCount = App.todos.length;
      var activeTodoCount = filters.getActiveTodos().length;
      var template = App.footerTemplate({
        activeTodoCount: activeTodoCount,
        activeTodoWord: util.pluralize(activeTodoCount, 'item'),
        completedTodos: todoCount - activeTodoCount,
        filter: App.filter
      });

      $('#footer').toggle(todoCount > 0).html(template);
    },
  };

	App.init();
});