'use strict';

// Requires
// - jQuery
//
P.plugins.view.Tabs = {

    // Children wil define
    //
//    el: $('#schema-create'),
//    tabs: {
//        tab_name_1: {
//            button: $('#tab-button-1'),
//            panel: $('#tab-panel-1')
//        },
//        tab_name_2: {
//            button: $('#tab-button-2'),
//            panel: $('#tab-panel-2')
//        }        
//    },

    onTabClick: function (e) {
        var tab = this.getTab(e.target.id);
        
        if (tab) {
            this.displayTab(tab);
        }
    },

    init: function () {
        var i,
            tabs_names = Object.keys(this.tabs);

        for (i=0; i<tabs_names.length; i++) {
            this.tabs[tabs_names[i]].button.on('click', $.proxy(this.onTabClick, this));
        }
    },

    getTab: function (el_id) {
        var i,
            tabs_names = Object.keys(this.tabs);

        for (i = 0; i<tabs_names.length; i++) {
            if (this.tabs[tabs_names[i]].button.attr('id') === el_id) {
                return this.tabs[tabs_names[i]];
            }
        }

        return false;
    },

    displayTab: function (tab) {
        var i,
            i_tab,
            tabs_names = Object.keys(this.tabs);

        // hide all tabs
        for (i = 0; i < tabs_names.length; i++) {
            i_tab = this.tabs[tabs_names[i]];
            i_tab.panel.hide();
            i_tab.button.removeClass('selected');            
        }
        // display tab
        tab.panel.show();
        tab.button.addClass('selected');        
    },

    show: function () {
        this.el.show();
    },

    hide: function () {
        this.el.hide();
    }

};
