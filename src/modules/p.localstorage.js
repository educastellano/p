'use strict';

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
