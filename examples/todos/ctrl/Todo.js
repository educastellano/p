'use strict';

App.ctrl.Todo = {

    view: App.view.Todo,

    create: function () {
        var me = this,
            name = $(this.view.newTag).val(),
            todo;

        if (name) {
            todo = App.model.Todo.create({
                name: name
            });

            todo.save({
                success: function () {
                    App.list.Todos.add(todo);
                    $(me.view.newTag).val('');
                }
            });
        }
    },

    edit: function (uuid, attr, value) {
        var todo = App.list.Todos.getById(uuid);

        if (todo) {
            todo.set(attr, value);
            todo.save();
        }
    },

    destroy: function (uuid) {
        var todo;

        if (uuid) {
            todo = App.list.Todos.removeById(uuid);
            todo.destroy();
        }
    }

};

