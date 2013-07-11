'use strict';

// Alternative js for Twitter Bootstrap Tabs
//
// Requires
// - jQuery
//
P.plugins.view.BootsTabs = {

    // Children wil define
    //
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

    active_button_class: 'active',

    displayTab: function (tab_name) {
        var i,
            i_tab,
            tabs_names = Object.keys(this.tabs);

        // hide all tabs
        for (i = 0; i < tabs_names.length; i++) {
            i_tab = this.tabs[tabs_names[i]];
            i_tab.panel.hide();
            i_tab.button.removeClass(this.active_button_class);
        }
        // display tab
        this.tabs[tab_name].panel.show();
        this.tabs[tab_name].button.addClass(this.active_button_class);
    }

};
