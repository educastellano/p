'use strict';

// Requires:
//  P
//  jQuery

P.plugins.view.Row = P.inherits(P.View, {
    $name: 'Row',

    // Children will define:
    //    model: ,
    //    el: $()
    //    template:   Handlebars.compile($("#item-template").html()),
    //    css_selected: ''

    handlers: {
        'model.change': P.databind.onModelChange,
        onRowClick: function (e) {
            this.trigger('click', {row: this, e: e});
        }
    },

    render: function () {
        this.el = $(this.template(this.viewModel()).trim());

        // events
        this.el.on('click', $.proxy(this.handlers.onRowClick, this));
    },

    select: function () {
        this.el.addClass(this.css_selected);
    }

});