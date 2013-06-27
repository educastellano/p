* Remove the requirement of setting functions names in P.Event.
* P.super() function?
* think a better way to set localstorage names in models
* small explanation about Prototype-based paradigm and inheritance.
	var TodoProto = { name: '', done: false, finish: function () { this.done = true; } }
	var todo = Object.create(TodoProto);
	todo.finish();