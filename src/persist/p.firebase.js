'use strict';

P.persistFirebase = function (method, model, options) {
    var returnData

    if (method === 'create') {
        model.fbRefModel = model.fbRef.push();
        model.fbRefModel.set(model.attr);
        model.attr[model.idAttr] = model.fbRefModel.name();
    }
    else if (method === 'update') {

    }
    else if (method === 'delete') {

    }
    else if (method === 'read') {

    }
    else {

    }

    if (options.success) {
        options.success(returnData);
    }
};


P.List.initFb = function () {
    var me = this;

    me.model.idAttr = 'fbId';
    me.model.persist = P.persistFirebase;
    me.persist = P.persistFirebase;

    me.model.fbRef.on('child_added', function (snapshot) {
        var attr = snapshot.val(),
            model;

        attr[me.model.idAttr] = snapshot.name();
        model = me.add(attr);
        model.fbRefModel = snapshot.ref();
    });

    me.model.fbRef.on('child_removed', function (snapshot) {
        var id = snapshot.name(),
            model;

        me.removeById(id);
    });

    me.model.fbRef.on('child_changed', function (snapshot) {
        var id = snapshot.val(),
            attr = snapshot.val(),
            model = me.getById(id),
            keys = Object.keys(attr),
            attr_name,
            i;

        if (model) {
            for (i=0; i<keys.length; i++) {
                attr_name = keys[i];
                if (attr[attr_name] !== model.get(attr_name)) {
                    model.set(attr_name, attr[attr_name]);
                }
            }
        }

    });
};

