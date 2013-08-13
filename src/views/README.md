# ""Abstract"" Views

## List and Row  
    
HTML:

	<table>
		<thead>
			<th>name</th>
			<th>email</th>
		</thead>
		<tbody id="people-list">
			<script id="person-template" type="text/x-handlebars-template">
			<tr>
				<td>{{{ name }}}</td>
				<td>{{{ email }}}</td>
			</tr>
			</script>
		</tbody>
	</table>

Row View:

	App.PersonRow = P.inherits(P.plugins.view.Row, {
    	template:   Handlebars.compile($("#person-template").html()),
	});

List View:

	App.PersonList = P.inherits(P.plugins.view.List, {
		el: $('#people-list'),
		list: App.People,
		rowView: App.PersonRow
	});


## Form

HTML:

	<div id="person-form">
		<input type="text" id="person-name"  />
		<input type="text" id="person-email" />
		<button id="person-submit">Submit</button>
	</div>

View:

	App.PersonForm = P.inherits(P.plugins.view.Form, {

    	el: $('#person-form'),
	    el_submit: $('#person-submit'),
	    inputs: {
    	    name: {
        	    el: $('#person-name')
	        },
    	    email: {
        	    el: $('#person-email')
	        }
    	},

    	onSubmit: function (values) {
			// whatever you need here.
	    },

    	render: function (model) {
        	if (model) {
				// edition
	        }
    	    else {
				// creation
	        }
    	}
	});





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

## BootsTabs

HTML:

View:



