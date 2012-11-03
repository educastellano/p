'use strict';

App.model.Todo = P.inherits(P.Model, {
    $name: 'Todo'
});

//
// Lists
//

App.list.Todos = P.inherits(P.List, {
    model: App.model.Todo
});