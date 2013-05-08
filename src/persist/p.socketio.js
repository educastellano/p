'use strict';

// Client->Server CRUD operations
//
P.persistSocketIO = function (method, model, options) {
    // TODO
};

// Server->Client CRUD operations
//
P.plugins.socketio = function (options) {
    var i,
        initSocketToList;

    initSocketToList = function (list) {
        list.socket = io.connect(location.origin);
        list.socket.on(list.model.api, function (data) {
            var getBy = data.getBy || list.model.idAttr,
                model = list.getBy(getBy, data.data[getBy]),
                attrs,
                i;

            if (model) {
                if (data.method === 'update') {
                    attrs = Object.keys(data.data);
                    for (i=0; i<attrs.length; i++) {
                        model.set(attrs[i], data.data[attrs[i]], { no_change: true });
                    }
                }
                else {
                    console.log('P.plugins.socketio:: method "'+ data.method +'" not supported');
                }
            }
        });
    };

    for (i=0; i<options.lists.length; i++) {
        initSocketToList(options.lists[i]);
    }
};
