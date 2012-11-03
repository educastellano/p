'use strict';

$(document).ready(function() {

    // init views
    App.view.Todo.init();

    // Load data
    App.list.Todos.load();

});