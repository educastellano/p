'use strict';

// Requires:
//  P
//  Row

P.plugins.view.List = P.inherits(P.View, {
    $name: 'List',

    // Children will define:
    //    el: $('#items'),
    //    list: App.list.Items,
    //    views: [],
    //    rowView:
    //    selectable: function() (Optional)
    //    sortable: function() (Optional)

    handlers: {
        onListLoad: function onListLoad(e, list) {
            this.render(list);
        },
        onListAdd: function onListAdd(e, model) {
            this.append(model);
        },
        onListRemove: function onListRemove(e, model) {
            this.remove(model);
        },
        onRowClick: function onRowClick(e, row) {
            this.trigger('rowclick', {row: row, list: this});
        }
    },

    render: function (list) {
        this.clear();

        for (var i=0; i<list.count(); i++) {
            this.append(list.getAt(i));
        }

        if (this.selectable) {
            this.selectable();
        }

        if (this.sortable) {
            this.sortable();
        }
    },

    clear: function () {
        var i;
        for (i=0; i<this.views.length; i++) {
            this.views[i].destroy();
        }
        // jQuery update event, used by some plugins
        this.el.trigger('update');
    },

    append: function (model) {
        var view = this.rowView.create({
            model: model
        });
        view.render();
        this.el.append(view.el);
        view.on('click', this.handlers.onRowClick, this);
        this.views.push(view);
        if (model.__fade__) {
            if (typeof model.__fade__ === 'function') {
                model.__fade__(view.el);
            }
            else {
                if (tk && tk.dom) {
                    tk.dom.fade(view.el);
                }
            }
            delete model.__fade__;
        }
        // jQuery update event, used by some plugins
        this.el.trigger('update');
    },

    remove: function (model) {
        var i;
        for (i=0; i<this.views.length; i++) {
            if (this.views[i].model.getId() === model.getId()) {
                this.views[i].destroy();
                // jQuery update event, used by some plugins
                this.el.trigger('update');
                break;
            }
        }
    },

    selectOne: function (item) {
        var i;
        this.el.find('.item').removeClass(this.rowView.css_selected);
        for (i=0; i<this.views.length; i++) {
             if (this.views[i].model.getId() === item.getId()) {
                 this.views[i].select();
                 break;
             }
        }
    }

});

