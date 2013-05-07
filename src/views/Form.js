'use strict';

// Requires:
//  P
//  jQuery

P.plugins.view.Form = P.inherits(P.View, {
    $name: 'Form',

    // Children will define:
    //    el: '',
    //    el_submit: '',
    //    inputs: {
    //        email: {
    //            el: '',
    //            required: true,
    //            val: function () {
    //
    //            }
    //        }
    //    },
    //    onSubmit: function (values) {},

    init: function () {
        var me = this;

        P.View.init.call(this);

        if (this.onSubmit) {
            this.el_submit.on('click', function (e) {
                var values = me.getValues();
                if (me.validate(values)) {
                    me.onSubmit(values);
                }
            });
        }
    },

    getValues: function () {
        var input_names = Object.keys(this.inputs),
            values = {},
            input,
            i;

        for (i=0; i<input_names.length; i++) {
            input = this.inputs[input_names[i]];
            if (input.val) {
                values[input_names[i]] = input.val();
            }
            else {
                values[input_names[i]] = input.el.val();
            }
        }

        return values;
    },

    validate: function (values) {
        var input_names = Object.keys(this.inputs),
            input,
            i;

        for (i=0; i<input_names.length; i++) {
            input = this.inputs[input_names[i]];
            if (input.required && !values[input_names[i]]) {
                this.fadeInput(input.el);
                input.el.focus();
                return false;
            }
        }

        return true;
    },

    fadeInput: function (el) {
        this.fade(el.get(0));
    },

    fade: function (node) {
        var level = 0,
            initialLevel = 10,
            timeoutStep = 80,
            step;

        node = $(node);

        step = function () {
            var hex = level.toString(initialLevel);
            node.css('background-color', '#ff00' + hex + hex);
            if (level < initialLevel-1) {
                level += 1;
                setTimeout(step, timeoutStep);
            }
            else {
                node.css('background-color', '');
            }
        };

        setTimeout(step, timeoutStep);
    }

});
