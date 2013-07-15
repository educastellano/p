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
        onListLoad: function onListLoad(e, args) {
            this.render(args.list);
        },
        onListAdd: function onListAdd(e, args) {
            this.append(args.model, args);
        },
        onListRemove: function onListRemove(e, args) {
            this.remove(args.model);
        },
        onListLoadError: function onListLoadError(e, args) {
            this.clear();
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

        if (this.pagination && !this.is_rendered) {
            this.pagination();
        }

        this.is_rendered = true;
    },

    clear: function () {
        var i;
        for (i=0; i<this.views.length; i++) {
            this.views[i].destroy();
        }
        // jQuery update event, used by some plugins
        this.el.trigger('update');
    },

    append: function (model, options) {
        var view = this.rowView.create({
            model: model
        });
        view.render();
        this.el.append(view.el);
        view.on('click', this.handlers.onRowClick, this);
        this.views.push(view);
        if (options && options.fade) {
            if (typeof options.fade === 'function') {
                options.fade(view.el);
            }
            else {
                if (this.fade) {
                    this.fade(view.el);
                }
            }
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

    selectOne: function (model) {
        var i;
        this.unSelect();
        for (i=0; i<this.views.length; i++) {
             if (this.views[i].model.getId() === model.getId()) {
                 this.views[i].select();
                 break;
             }
        }
    },

    unSelect: function () {
        this.el.children().removeClass(this.rowView.css_selected);
    }

});

