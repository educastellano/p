'use strict';

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

    if (P.List.isPrototypeOf(model) && model.model) {
        if (!model.url) { // TODO (quickfix) lists probably shouldn't contain the url for the next releases
            model = model.model;
        }
    }

    // Set data for updates
    if (method === 'create' || method === 'update') {
        data = options.data || (method === 'create' ? model.attr : model.changed);
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
        params.url = api.call(model, options.urlParams, method);
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
