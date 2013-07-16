__IMPORTANT__: There is not any stable release of this lib yet.

P
=
P is a tiny MV* library to help you structuring your apps. 

It's strongly based in other frameworks such as Backbone, but its aim is to be a simple library rather than a framework.


# Features

* Simple
* Prototypal inheritance (No use of the "new" operator)
* The core (p.js) is nothing else than a MV* library


# Prototype-based MV*

Prototype-based paradigm is:

* From [wikipedia](http://en.wikipedia.org/wiki/Prototype-based_programming) (2013/07/01):

	"…a style of object-oriented programming in which classes are not present, and behavior reuse (known as inheritance in class-based languages) is performed via a process of cloning existing objects that serve as prototypes. This model can also be known as classless, prototype-oriented or instance-based programming...".

* From Crockford, Douglas (2008) [*Javascript: The Good Parts*](http://shop.oreilly.com/product/9780596517748.do):

	"…In classical languages, objects are instances of classes, and a class can inherit from another class. JavaScript is a prototypal language, which means that objects inherit directly from other objects…".

With a prototype-based language such as js you can" do stuff like this:

	var TodoProto = { 
		name: '', 
		done: false, 
		finish: function () { 
			this.done = true; 
		} 
	};
	
	var todo = Object.create(TodoProto);
	todo.name = 'write this doc';
	todo.finish();
	console.log(todo.done);

If we want to build an app following some kind of MV pattern:


	var TodoProto = { 
		name: '', 
		done: false, 
		save: function () {
			// ...
		},
		fetch: function () { 
			// ...
		},
		destroy: function () { 
			// ...
		}
		// ...
	};
	var TodoListProto = {
		data: [],
		load: function () {
			// ...
		},
		add: function (todo) {
			// ...
			this.data.push(todo)
			// ...
		},
		remove: function () {
			// ...
		}
	};
	var TodoViewProto = {
		//...
		render: function (todo) {
			// ...
		}		
	};
	
	// load some data
	var list = Object.create(TodoListProto);	
	list.load();
	
	// create a todo
	var todo = Object.create(TodoProto);
	todo.name = 'write this doc';
	todo.save();
	list.add(todo);
	
	// render it (after some event handling...)
	var view = Object.create(TodoViewProto);
	view.render(todo);


As we can see above, if we want to create other types of data we would duplicate a lot of code.  
P provides 3 objects to be used as prototypes to boilerplate an MV* app: Model, List and View, plus the object Event which the other 3 inherit from. So, to create our protoypes we now need to inherit from those 3 objects: 


	var TodoProto = P.inherits(P.Model, { 
		name: '', 
		done: false, 
		finish: function () { 
			this.done = true; 
		}
	});
	var TodoListProto = P.inherits(P.List, {
		model: TodoProto
	});
	var TodoViewProto = P.inherits(P.View, {
		render: function (todo) {
			// ...
		}		
	});

Except for the *render()* method in the view, the rest of the methods have been factored.

P also provides an *inherit()* method to make easier to use the second parameter of the ECMAScript5 function [Object.create(proto [, propertiesObject ])](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create), which each property of the object we create needs to be "configured".


# Getting started

Initializations and definition of the persistence strategy:
  
	this.App = {};
	P.persist = P.persistREST;

Define models:

	App.Person = P.inherits(P.Model, {
	    api: '/api/0/person'
	});

Define views:

	App.PersonView = P.inherits(P.View, {

	    el: $('#person'),

	    handlers: {
	        'model.load': function onModelLoad(e, model) {
	            this.render(model);
	        }
    	},
    	
    	render: function (model) {
    		// render it the way you want
    	}

	});

Fetch data:

-- ...

# Install

Get the [compiled and minified version](https://raw.github.com/educastellano/p/master/dist/p-0.0.3.min.js) and include it to your application.

# Docs

For the full documentation visit [this site](https://github.com/educastellano/p/tree/master/

# Changelog

### dev version
* P.View - Event handling has changed. Handlers are formed now with '[object]:[event]': function () {}

### 0.0.4
* P.Model.save - 'method' can be passed in the options argument.
* P.Model.destroy - Fix: passing urlParams in xhrOptions.
* P.Model.getRespAttr - support for empty root attribute.
* P.Model.setValues created. P.Model can now set multiple values.
* P.Model.fetch fix - fetch event is fired from the model prototype, instead of the new object.
* P.List.load and P.View.init - loaderror event added. Also handled it in List view.
* P.List.getRespData - saving attributes other than data when root specified.

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
