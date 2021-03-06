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
    //    pagination: {} (Optional)

    handlers: {
        'list.load': function onListLoad(e, args) {
            this.render(args.list);
        },
        'list.add': function onListAdd(e, args) {
            this.append(args.model, args);
        },
        'list.remove': function onListRemove(e, args) {
            this.remove(args.model);
        },
        'list.clear': function onListClear(e, args) {
            this.clear();
        },
        'list.loaderror': function onListLoadError(e, args) {
            this.clear();
        },
        onRowClick: function onRowClick(e, args) {
            this.trigger('rowclick', {row: args.row, list: this, e: args.e});
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

        if (this.pagination) {
            this.setPagination();
        }
    },

    clear: function () {
        var i;
        if (this.views) {
            for (i = 0; i < this.views.length; i++) {
                this.views[i].destroy();
            }
            // jQuery update event, used by some plugins
            this.el.trigger('update');
        }
    },

    append: function (model, options) {
        var view = this.rowView.create({
            model: model
        });
        view.create_el();
        view.init();
        this.views = this.views || [];
        if (options && options.prepend) {
            this.el.prepend(view.el);
            this.views.unshift(view);
        }
        else {
            this.el.append(view.el);
            this.views.push(view);
        }
        view.on('click', this.handlers.onRowClick, this);
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
        if (this.views) {
            for (i = 0; i < this.views.length; i++) {
                if (this.views[i].model.getId() === model.getId()) {
                    this.views[i].destroy();
                    // jQuery update event, used by some plugins
                    this.el.trigger('update');
                    break;
                }
            }
        }
    },

    selectOne: function (model) {
        var i;
        if (this.views) {
            this.unSelect();
            for (i = 0; i < this.views.length; i++) {
                if (this.views[i].model.getId() === model.getId()) {
                    this.views[i].select();
                    break;
                }
            }
        }
    },

    unSelect: function () {
        this.el.children().removeClass(this.rowView.css_selected);
    },

    setPagination: function () {
        var me = this;

        if (this._page_changing) {
            this._page_changing = false;
        }
        else {
            this.pagination.el.bootstrapPaginator({
                currentPage: 1,
                totalPages: Math.ceil(this.list.attr.total_count / me.pagination.limit),
                onPageChanged: function (e, oldPage, newPage) {
                    var params = me.list.urlParams || {};
                    params.start = newPage - 1;
                    params.limit = me.pagination.limit;
                    me._page_changing = true;
                    me.list.load({
                        urlParams: params
                    });
                }
            });
        }
    }

});

