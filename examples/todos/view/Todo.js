'use strict';

App.view.Todo = P.inherits(P.View, {

    list: App.list.Todos,

    rootTag: '#todos',
    newTag: '#new-todo',
    listTag: '#todo-list',

    handlers: {
        onListLoad: function onListLoad(e, list) {
            this.render(list);
        },
        onListAdd: function onListAdd(event, model) {
            this.append(model);
        },
        onListRemove: function onListRemove(event, model) {
            this.remove(model);
        },
        onNewKeyPress: function (e) {
            if (e.keyCode === 13) {
                App.ctrl.Todo.create();
            }
        },
        onNameDblClick: function (e) {
            var li = $(e.target).parent().parent(), 
                input = li.children('input');
            li.addClass('editing');
            input.focus();
            input.select();
        },
        onInputKeyPress: function (e) {
            var input = $(e.target),
                li = input.parent(), 
                uuid = li.attr('data-uuid');
            if (e.keyCode === 13) {
                App.ctrl.Todo.edit(uuid, 'name', input.val());
                li.find('.title').html(input.val());
                li.removeClass('editing');
            }
        },
        onInputBlur: function (e) {
            var input = $(e.target),
                li = input.parent(), 
                oldVal = li.find('.title').html();

            input.val(oldVal);
            li.removeClass('editing');
        },
        onDestroyClick: function (e) {
            var uuid = $(e.target).parent().parent().attr('data-uuid'); 
            App.ctrl.Todo.destroy(uuid);
        },
        onDoneToggle: function (e) {
            var li = $(e.target).parent().parent(), 
                uuid = li.attr('data-uuid'),
                done = $(e.target).attr('checked') ? true : false;

            if (done) {
                li.addClass('completed');
            }
            else {
                li.removeClass('completed');
            }
            App.ctrl.Todo.edit(uuid, 'done', done);
        }
    },

    init: function () {
        Object.getPrototypeOf(this).init.call(this);

        $(this.newTag).on('keypress', this.handlers.onNewKeyPress);
    },

    render: function (list) {
        var i,
            html = '';

        for (i=0; i<list.count(); i++) {
            html += this.htmlTodo(list.getAt(i));
        }

        $(this.listTag).append(html);
        $(this.listTag).find('.toggle').on('click', this.handlers.onDoneToggle);
        $(this.listTag).find('.title').on('dblclick', this.handlers.onNameDblClick);
        $(this.listTag).find('.edit').on('keypress', this.handlers.onInputKeyPress);
        $(this.listTag).find('.edit').on('blur', this.handlers.onInputBlur);
        $(this.listTag).find('.destroy').on('click', this.handlers.onDestroyClick);
    },

    append: function (todo) {
        var html = this.htmlTodo(todo);

        $(this.listTag).append(html);
        $(this.listTag).find('[data-uuid="'+ todo.getId() +'"]').find('.toggle').on('click', this.handlers.onDoneToggle);
        $(this.listTag).find('[data-uuid="'+ todo.getId() +'"]').find('.title').on('dblclick', this.handlers.onNameDblClick);
        $(this.listTag).find('[data-uuid="'+ todo.getId() +'"]').find('.edit').on('keypress', this.handlers.onInputKeyPress);
        $(this.listTag).find('[data-uuid="'+ todo.getId() +'"]').find('.edit').on('blur', this.handlers.onInputBlur);
        $(this.listTag).find('[data-uuid="'+ todo.getId() +'"]').find('.destroy').on('click', this.handlers.onDestroyClick);
    },

    remove: function (todo) {
        $(this.listTag).find('[data-uuid="'+ todo.getId() +'"]').remove();
    },

    //
    // Please! Use your fav templating lib instead :)
    //
    htmlTodo: function (todo) {
        var html;

        html = '<li class="'+ (todo.get('done') ? 'completed' : '') +'" data-uuid="'+ todo.getId() +'">' +
            '<div class="view">' +
            '<input class="toggle" type="checkbox" '+ (todo.get('done') ? 'checked="checked"' : '') +'>' +
            '    <label class="title">'+ todo.get('name') +'</label>' +
            '    <button class="destroy"></button>' +
            '</div>' +
            '<input class="edit" value="'+ todo.get('name') +'">' +
            '</li>';

        return html;
    }

});