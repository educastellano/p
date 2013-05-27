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
        // no need to throw the error, data simply won't be changed.
    }
};

P.databind.bindData = function bindData (view, el, args) {
    var bind,
        aux,
        attrDOM,
        attr,
        i,
        value,
        children;

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

            if (args.fade) {
                if (typeof args.fade === 'boolean') {
                    P.databind.fade(el);
                }
                else if (typeof args.fade === 'function') {
                    args.fade(el);
                }
                else {
                    // no more types supported
                }
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
};

// default fade function
P.databind.fade = function (node) {
    var level = 0,
        initialLevel = 16,
        timeoutStep = 80,
        step;

    node = $(node);

    step = function () {
        var hex = level.toString(initialLevel);
        node.css('background-color', '#ffff' + hex + hex);
        if (level < initialLevel-1) {
            level += 1;
            setTimeout(step, timeoutStep);
        }
        else {
            node.css('background-color', '');
        }
    };

    setTimeout(step, timeoutStep);
};