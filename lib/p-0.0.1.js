
//
// P
//
// Requires
// - ES5
// - jQuery (or jQuery-compatible lib) for :
//      - the ajax call (we might not include the default persistence in this lib in the future...)
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

        set: function (attr, value, noEvent, noChange) {
            this.attr = this.attr || {};
            this.changed = this.changed || {};
            this.attr[attr] = value;
            if (!noChange) {
                this.changed[attr] = value;
            }
            if (!noEvent) {
                this.trigger('change', {model:this, attr: attr, value: value});
            }
        },

        getId: function () {
            this.attr = this.attr || {};
            return this.attr[this.idAttr];
        },

        getRespAttr: function (data) {
            var attr = data[this.root];

            if (attr && attr.length) {
                attr = attr[0];
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
                method = this.getId() ? 'update' : 'create',
                fnSuccess,
                fnError;

            options = options || {};
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

            xhrOptions.success = function (resp) {
                var data = me.root ? resp[me.root] : resp;

                if (data && data.length) {
                    model.attr = data[0];
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
                xhrOptions = {};

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
                    me.trigger('load', me);
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

        add: function (model) {
            this.data = this.data || [];
            this.rawData = this.rawData || [];

            if (!P.Model.isPrototypeOf(model)) {
                model = this.model.create(model);
            }

            this.data.push(model);
            this.rawData.push(model.attr);
            if (this.dataAdapter) {
                this.dataAdapter(model);
            }
            model.on('change', this.onModelChange, this);
            this.trigger('add', model);
        },

        remove: function (model) {
            if (model.getId()) {
                return this.removeById(model.getId());
            }
            else {
                return this.removeByCid(model.cid);
            }
        },

        removeByCid: function (cid) {
            // TODO
        },

        removeById: function (id) {
            var ids = Array.isArray(id) ? id : [id],
                i,
                model,
                models = [];

            for (i=0; i<ids.length; i++) {
                model = this.removeByAttr(this.model.idAttr, ids[i]);
                models.push(model);
            }

            return models.length === 1 ? models[0] : models;
        },

        removeByAttr: function (attr, value) {
            var i,
                model;

            if (this.data) {
                for (i=0; i<this.data.length; i++) {
                    if (this.data[i].attr[attr] === value) {
                        model = this.data[i];
                        model.off('change', this.onModelChange, this);
                        this.data.splice(i, 1);
                        this.rawData.splice(i, 1);
                        this.trigger('remove', model);
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

        count: function () {
            return this.data ? this.data.length : undefined;
        }

    });

    P.View = P.inherits(Object.prototype, {
        // children will define:
        // list or model
        // state (in the 'init' method)

        $name: 'View',

        init: function () {
            var lists = this.list,
                models = this.model,
                i;

            this.state = P.inherits(P.Event, {});

            if (this.handlers.onStateChange) {
                this.state.on('change', this.handlers.onStateChange, this);
            }

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
                    if (this.handlers.onModelChange) {
                        models[i].on('change', this.handlers.onModelChange, this);
                    }
                    if (this.handlers.onModelSave) {
                        models[i].on('save', this.handlers.onModelSave, this);
                    }
                }
            }
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

    // RESTful persistence
    P.persistREST = function (method, model, options) {
        var methodMap = model.methodMap || P.methodMap,
            type = methodMap[method],
            params = {
                type: type,
                dataType: 'json'
            },
            opt,
            data,
            api;

        options = options || {};


        // Set data for updates
        if (method === 'create' || method === 'update') {
            data = options.data || model.changed;
            if (data && Object.keys(data).length) {
                params.contentType = 'application/json';
                params.data = model.toDataAPI(data, method);
            }
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET') {
            params.processData = false;
        }

        // Override params with the user options
        for (opt in options) {
            if (options.hasOwnProperty(opt)) {
                params[opt] = options[opt];
            }
        }

        // Set URL
        api = model.api || model.url;
        if (typeof api === 'object') {
            params.url = api[method];
        }
        else if (typeof api === 'function') {
            params.url = api.call(model, options.urlParams);
            model.urlParams = options.urlParams;
            delete params.urlParams;
        }
        else { // string. RESTful url
            params.url = api;
            if (method !== 'create') {
                if (params.url[params.url.length-1] !== '/') {
                    params.url += '/';
                }
                params.url += model.getId();
            }
        }

        return $.ajax(params);
    };

    // localStorage persistence
    P.persistLocalStorage = function (method, model, options) {
        var name,
            jsonData,
            data,
            list,
            returnData,
            i;

        if (P.List.isPrototypeOf(model)) {
            list = model;
            model = list.model;
        }

        // get data
        name = model.localStorage || model.$name;
        jsonData = localStorage.getItem(name);
        if (jsonData) {
            data = JSON.parse(jsonData);
        }
        else {
            data = [];
        }

        // perfom operation
        if (method === 'create') {
            model.attr['uuid'] = P.fn.uuid();
            data.push(model.attr);
            returnData = model;

            // save data
            jsonData = JSON.stringify(data);
            localStorage.setItem(name, jsonData);
        }
        else if (method === 'update') {

            // save data
            jsonData = JSON.stringify(data);
            localStorage.setItem(name, jsonData);
        }
        else if (method === 'delete') {
            for (i=0; i<data.length; i++) {
                if (data[i].uuid === model.get('uuid')) {
                    data.splice(i, 1);
                }
            }

            // save data
            jsonData = JSON.stringify(data);
            localStorage.setItem(name, jsonData);
        }
        else if (method === 'read') {
            if (list) {
                returnData = data;
            }
            else {



            }
        }
        else {

        }


        if (options.success) {
            options.success(returnData);
        }
    };

    // Default persistence
    P.persist = P.persistREST;

})(this);
