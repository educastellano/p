# ""Abstract"" Views

## List

## Row

## Form

## Tabs

HTML:

	<div id="mytabs">
		<span id="tab-button-1" class="tab selected">Tab 1</span>
		<span id="tab-button-2" class="tab">Tab 2</span>
		<div id="tab-panel-1"></div>
		<div id="tab-panel-2"></div>
	</div>

View:

	App.MyTabs = P.inherits(P.plugins.view.Tabs, {
	
    	el: $('#mytabs'),
	    tabs: {
    	    tab_name_1: {
        	    button: $('#tab-button-1'),
            	panel: $('#tab-panel-1')
	        },
    	    tab_name_2: {
        	    button: $('#tab-button-2'),
            	panel: $('#tab-panel-2')
	        }
		}

	});



