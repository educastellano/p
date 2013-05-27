__IMPORTANT__: There is not any stable release of this lib yet.

P
=
P is a tiny MV* library to help you structuring your apps. 

It's strongly based in other frameworks such as Backbone, but its aim is to be a simple library rather than a framework.


Features
========

* Simple
* Prototypal inheritance (No use of the "new" operator)
* Nothing else than a MV* library

Install
=======

Get the [compiled and minified version](https://raw.github.com/educastellano/p/master/lib/p-0.0.3.min.js) and include it to your application.

# Some Basics

Define models:

	App.Person = P.inherits(P.Model, {
	    api: '/api/0/person'
	});

Define views:

	App.PersonView = P.inherits(P.View, {

	    el: $('#person'),

	    handlers: {
	        onModelLoad: function onModelLoad(e, model) {
	            this.render(model);
	        }
    	},
    	
    	render: function (model) {
    		// render it the way you want
    	}

	});

Fetch data:
	
	var person = App.Person.create();
	
	App.PersonView.model = person; 
	
	person.fetch({
		id: 1
	});

Changelog
=========
### 0.0.3
* P.persistREST and P.persistLocalStorage moved to other files. P.persist needs to be set by the app.
* P.data-bind.js file added
* P.Model.fetch fixes
* P.View.state removed
* P.persistREST - url fix for lists
* P.Model.set - extra arguments wrapped in options object. Custom event_args supported.
* P.List.add, P.List.remove optional parameter
* P.List.add, P.List.remove, P.List.load triggering event_args passed by parameter.

### 0.0.2
* P.Model.getRespAttr fix
* P.List.exists added
* P.List.add don't add if exists. Also returns the model.
* P.View inherits P.Event
* P.View.init handler onModelDestroy added
* P.View.create added
* P.View.destroy added
* P.View.viewModel method added. There is now the possibility to define viewModels through defViewModel.
* P.View.init onModelChange - default method to provide data binding

### 0.0.1

* P.List.loadNext removed
* P.List.length changed to P.List.count
* P.persistLocalStorage and P.persistREST added. 
* P.List.load using P.persist. Bugfixes in P.persistREST.
* P.List.root empty by default.
* P.List.getAt added
* P.fn.uuid function added
