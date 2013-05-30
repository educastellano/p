
//
// P
//
// Requires
// - ES5
// - jQuery (or jQuery-compatible lib) for :
//      - fn.clone function (we should move the functions in 'fn' object to a another lib)
//

(function (root) {
    'use strict';

    //
    // Namespacing, Prototypal Inheritance
    //
    var P = root.P = {};

    P.plugins = {
        model: {},
        list: {},
        view: {}
    };

    P.inherits = function (parent, child) {
        var es5Props = {},
            attr;

        for (attr in child) {
            if (child.hasOwnProperty(attr)) {
                es5Props[attr] = {
                    value: child[attr],
                    enumerable: true,
                    writable: true
                };
            }
        }

        return Object.create(parent, es5Props);
    };


    //
    // Helpers
    //
    P.fn = {
        Function: {
            name: function (f) {
                var fName;
                if (!f.name) {
                    fName = f.toString().match(/^function ([^(]+)/);
                    if (fName && fName.length > 1) {
                        return fName[1];
                    }
                }
                return f.name;
            }
        },
        newId: (function() {
            var id = 0;
            return function() { return ++id; };
        })(),
        uuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        clone: function (obj, shallow) {
            var cloned,
                i;

            if (Array.isArray(obj)) {
                cloned = [];
                for (i=0; i<obj.length; i++) {
                    cloned.push(P.fn.clone(obj[i]));
                }
            }
            else {
                if (shallow) {
                    cloned = jQuery.extend({}, obj);
                }
                else {
                    cloned = jQuery.extend(true, {}, obj);
                }
            }

            return cloned;
        }
    };


    //
    // Event
    //
    P.Event = P.inherits(Object.prototype, {

        $name: 'Event',

        trigger: function (event, args) {
            var subscribers,
                i,
                scope;

            if (this.events) {
                subscribers = this.events[event];
                if (subscribers) {
                    for (i=0; i<subscribers.length; i++) {
                        scope = subscribers[i].scope || this;
                        subscribers[i].func.call(scope, event, args);
                    }
                }
            }
        },

        on: function(event, func, scope) {
            var events = this.events || (this.events = {}),
                exists;

            if (!P.fn.Function.name(func)) {
                throw new Error('P.Event.on(): Anonymous functions are not allowed. [' + event + ', ' + func + ']');
            }

            if (!events[event]) {
                events[event] = [];
            }

            exists = function(x) {
                return x.func === func;
            };

            if (!events[event].some(exists)) {
                events[event].push({
                    func: func,
                    scope: scope
                });
            }
        },

        off: function (event, func) {
            var events = this.events || (this.events = {}),
                i;

            if (!P.fn.Function.name(func)) {
                throw new Error('P.Event.on(): Anonymous functions are not allowed. [' + event + ', ' + func + ']');
            }

            for (i=0; i < events[event].length; i++) {
                if (events[event][i].func === func) {
                    events[event].splice(i, 1);
                    break;
                }
            }
        }

    });


    //
    // Model
    //
    P.Model = P.inherits(P.Event, {
        // children will define:
        // attr: {},
        // changed: {},
        // api: {}, or '' or function
        // url: ''

        $name: 'Model',
        idAttr: 'id',
        root: 'data',

        get: function (attr) {
            this.attr = this.attr || {};
            return this.attr[attr];
        },

        set: function (attr, value, options) {
            var event_args;

            this.attr = this.attr || {};
            this.changed = this.changed || {};
            this.attr[attr] = value;
            if (!options || !options.no_change) {
                this.changed[attr] = value;
            }
            if (!options || !options.no_event) {
                event_args = {
                    model:this,
                    attr: attr,
                    value: value
                };
                if (options && options.event_args) {
                    event_args = P.inherits(event_args, options.event_args);
                }
                this.trigger('change', event_args);
            }
        },

        getId: function () {
            this.attr = this.attr || {};
            return this.attr[this.idAttr];
        },

        getRespAttr: function (data) {
            var attr;

            if (data) {
                attr = data[this.root];
                if (attr && attr.length) {
                    attr = attr[0];
                }
            }

            return attr;
        },

        toDataAPI: function (data, method) {
            return JSON.stringify(data);
        },

        create: function (attr) {
            var model = Object.create(this);

            model.cid = P.fn.newId();
            if (attr) {
                model.attr = attr;
            }
            else {
                model.attr = {};
            }

            return model;
        },

        save: function (options) {
            var me = this,
                method,
                fnSuccess,
                fnError;

            options = options || {};
            method = options.method || (this.getId() ? 'update' : 'create');
            delete options.method;
            fnSuccess = options.success;
            fnError = options.error;
            options.success = function (resp) {
                var attr = me.getRespAttr(resp);

                if (attr) {
                    me.attr = attr;
                }
                delete me.changed;
                me.trigger('save', this);
                if (fnSuccess) {
                    fnSuccess(resp);
                }
            };
            options.error =  function (resp) {
                if (fnError) {
                    fnError(resp);
                }
            };

            (this.persist || P.persist)(method, this, options);
        },

        fetch: function (options) {
            var me = this,
                xhrOptions = {},
                model;

            options = options || {};

            if (options.id) {
                model = this.create();
                model.attr[this.idAttr] = options.id;
            }
            else {
                model = this;
            }

	        xhrOptions.urlParams = options.urlParams;

            xhrOptions.success = function (resp) {
                var data = me.root ? resp[me.root] : resp;

                if (Array.isArray(data)) {
                    if (data && data.length) {
                        model.attr = data[0];
                    }
                }
                else {
                    if (data && Object.keys(data).length) {
                        model.attr = data;
                    }
                }

                model.trigger('fetch', model);
                if (options.success) {
                    options.success(model);
                }
            };
            xhrOptions.error = options.error;

            (this.persist || P.persist)('read', model, xhrOptions);
        },

        destroy: function (options) {
            var me = this,
                xhrOptions = {},
                model;

            options = options || {};

            if (options.id) {
                model = this.create();
                model.attr[this.idAttr] = options.id;
            }
            else {
                model = this;
            }

            xhrOptions.urlParams = options.urlParams;

            xhrOptions.success = function (resp) {
                model.trigger('destroy', model);
                if (options.success) {
                    options.success(model);
                }
            };
            xhrOptions.error = options.error;

            (this.persist || P.persist)('delete', model, xhrOptions);
        }

    });


    //
    // List
    //
    P.List = P.inherits(P.Event, {
        // children will define:
        // model: ,
        // data: [],
        // url: '',
        // children might define:
        // root: 'data'
        //
        //

        $name: 'List',

        getRespData: function (resp) {
            var data;

            if (typeof resp !== 'string') {
                if (this.root) {
                    data = resp[this.root];
                }
                else {
                    data = resp;
                }
            }

            return data;
        },

        onModelChange: function onModelChange(e, args) {
            this.trigger('change', args);
        },

        create: function () {
            return Object.create(this);
        },

        load: function (options) {
            var me = this,
                xhrOptions = {},
                event_args;

            options = options || {};

            if (!options.noEvent) {
                this.trigger('beforeload', this);
            }

            xhrOptions.url = options.url || this.url;
            xhrOptions.urlParams = options.urlParams;

            xhrOptions.success = function (resp) {
                var data = me.getRespData(resp),
                    model,
                    i;

                me.data = [];
                me.rawData = [];
                delete me.totalElements;

                if (data) {
                    if (me.model) {
                        for (i=0; i<data.length; i++) {
                            model = me.model.create(data[i]);
                            me.data.push(model);
                            me.rawData.push(model.attr); // explicit ref. to model attr
                            model.on('change', me.onModelChange, me);
                        }
                    }
                    else {
                        me.rawData = data;
                    }
                }

                if (me.dataAdapter) {
                    me.dataAdapter.call(me, me.data);
                }

                if (!options.noEvent) {
                    event_args = options.event_args || {};
                    event_args.list = me;
                    me.trigger('load', event_args);
                }

                if (options.success) {
                    options.success();
                }
            };

            xhrOptions.error = function (resp) {
                if (options.error) {
                    options.error(resp);
                }
            };

            (this.persist || P.persist)('read', this, xhrOptions);
        },

        clear: function () {
            this.data = [];
            this.rawData = [];
            delete this.totalElements;
            this.trigger('clear', this);
        },

        add: function (model, options) {
            var event_args;

            this.data = this.data || [];
            this.rawData = this.rawData || [];

            if (!P.Model.isPrototypeOf(model)) {
                model = this.model.create(model);
            }

            if (this.exists(model.getId())) {
                return false;
            }

            this.data.push(model);
            this.rawData.push(model.attr);
            if (this.dataAdapter) {
                this.dataAdapter(model);
            }
            model.on('change', this.onModelChange, this);
            event_args = options && options.event_args || {};
            event_args.model = model;
            this.trigger('add', event_args);

            return model;
        },

        remove: function (model, options) {
            if (model.getId()) {
                return this.removeById(model.getId(), options);
            }
            else {
                return this.removeByCid(model.cid, options);
            }
        },

        removeByCid: function (cid, options) {
            // TODO
        },

        removeById: function (id, options) {
            var ids = Array.isArray(id) ? id : [id],
                i,
                model,
                models = [];

            for (i=0; i<ids.length; i++) {
                model = this.removeByAttr(this.model.idAttr, ids[i], options);
                models.push(model);
            }

            return models.length === 1 ? models[0] : models;
        },

        removeByAttr: function (attr, value, options) {
            var i,
                model,
                event_args;

            if (this.data) {
                for (i=0; i<this.data.length; i++) {
                    if (this.data[i].attr[attr] === value) {
                        model = this.data[i];
                        model.off('change', this.onModelChange, this);
                        this.data.splice(i, 1);
                        this.rawData.splice(i, 1);
                        event_args = options && options.event_args || {};
                        event_args.model = model;
                        this.trigger('remove', event_args);
                        return model;
                    }
                }
            }

            return false;
        },

        getAt: function (idx) {
            return this.data[idx];
        },

        getByCid: function (cid) {
            var i;

            if (this.data) {
                for (i=0; i<this.data.length; i++) {
                    if (this.data[i] && this.data[i].cid && this.data[i].cid === cid) {
                        return this.data[i];
                    }
                }
            }

            return false;
        },

        getById: function (id) {
            return this.getBy(this.model.idAttr, id);
        },

        getBy: function (prop, value) {
            var i;

            if (this.data) {
                for (i=0; i<this.data.length; i++) {
                    if (this.data[i] && this.data[i].get(prop) && this.data[i].get(prop) === value) {
                        return this.data[i];
                    }
                }
            }

            return false;
        },

        exists: function (id) {
            return !!this.getById(id);
        },

        count: function () {
            return this.data ? this.data.length : undefined;
        }

    });

    P.View = P.inherits(P.Event, {
        // children will define:
        // list or model

        $name: 'View',

        init: function () {
            var lists = this.list,
                models = this.model,
                i,
                onModelChange;

            if (lists) {
                if (!Array.isArray(lists)) {
                    lists = [lists];
                }
                for (i=0; i<lists.length; i++) {
                    if (this.handlers.onListLoad) {
                        lists[i].on('load', this.handlers.onListLoad, this);
                    }
                    if (this.handlers.onListClear) {
                        lists[i].on('clear', this.handlers.onListClear, this);
                    }
                    if (this.handlers.onListAdd) {
                        lists[i].on('add', this.handlers.onListAdd, this);
                    }
                    if (this.handlers.onListRemove) {
                        lists[i].on('remove', this.handlers.onListRemove, this);
                    }
                    if (this.handlers.onListBeforeLoad) {
                        lists[i].on('beforeload', this.handlers.onListBeforeLoad, this);
                    }
                    if (this.handlers.onListChange) {
                        lists[i].on('change', this.handlers.onListChange, this);
                    }
                }
            }

            if (models) {
                if (!Array.isArray(models)) {
                    models = [models];
                }
                for (i=0; i<models.length; i++) {
                    onModelChange = this.handlers.onModelChange || this.onModelChange;
                    if (onModelChange) {
                        models[i].on('change', onModelChange, this);
                    }
                    if (this.handlers.onModelSave) {
                        models[i].on('save', this.handlers.onModelSave, this);
                    }
                    if (this.handlers.onModelDestroy) {
                        models[i].on('destroy', this.handlers.onModelDestroy, this);
                    }
                }
            }
        },

        viewModel: function () {
            var result = {},
                attrname,
                value;

            if (this.model) {
                if (this.defViewModel) {
                    for (attrname in this.model.attr) {
                        value = this.model.attr[attrname];
                        if (attrname in this.defViewModel) {
                            result[attrname] = this.defViewModel[attrname](value);
                        }
                        else {
                            result[attrname] = value;
                        }
                    }
                }
                else {
                    result = this.model.attr;
                }
            }

            return result;
        },

        create: function (options) {
            var view = Object.create(this);

            view.model = options.model;
            view.list = options.list;
            view.el = options.el;
            view.rootTag = options.rootTag;
            view.init();

            return view;
        },

        destroy: function () {
            this.el.remove();
        }

    });


    //
    // Persistence
    //

    P.methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read':   'GET'
    };

    // P.persist  function must be overwritten
    //            it accepts these parameters: (method, model, options)


})(this);
