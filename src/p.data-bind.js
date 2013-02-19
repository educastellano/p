'use strict';

P.databind = {};

P.databind.onModelChange = function onModelChange (e, args) {
    var i,
        el;

    try {
        for (i=0; i<this.el.length; i++) {
            el = $(this.el.get(i));
            P.databind.bindData(this, el, args);
        }
    }
    catch (e) {

    }
};

P.databind.bindData = function bindData (view, el, args) {
    var bind,
        aux,
        attrDOM,
        attr,
        el,
        i,
        value,
        children;

    if (el) {
        bind = el.data().bind;
        if (bind) {
            aux = bind.split(':');
            attrDOM = aux[0];
            attr = aux[1];
            if (attr === args.attr) {
                if (view.defViewModel && view.defViewModel[attr]) {
                    value = view.defViewModel[attr](args.value);
                }
                else {
                    value = args.value;
                }

                if (attrDOM === 'text' || attrDOM === 'html') {
                    el[attrDOM](value);
                }
                else {
                    el.attr(attrDOM, value);
                }
            }
        }
        children = el.children();
        for (i=0; i<children.length; i++) {
            bindData(view, $(children.get(i)), args);
        }
    }
};