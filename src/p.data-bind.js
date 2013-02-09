'use strict';


P.View.onModelChange = function onModelChange (e, args) {
    var bind,
        aux,
        attrDOM,
        attr,
        el,
        i,
        value;

    //
    // TODO check for recursively tags

    try {
        for (i=0; i<this.el.length; i++) {
            el = $(this.el.get(i));
            bind = el.data().bind;

            if (bind) {
                aux = bind.split(':');
                attrDOM = aux[0];
                attr = aux[1];
                if (attr === args.attr) {
                    debugger;

                    if (this.defViewModel && this.defViewModel[attr]) {
                        value = this.defViewModel[attr](args.value);
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
        }
    }
    catch (e) {

    }

};