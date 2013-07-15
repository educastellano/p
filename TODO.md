* Remove the requirement of setting functions names in P.Event.
* P.super() function?
* think a better way to set localstorage names in models
* small explanation about Prototype-based paradigm and inheritance.
	var TodoProto = { name: '', done: false, finish: function () { this.done = true; } }
	var todo = Object.create(TodoProto);
	todo.finish();
* better event handling. views should be able to do thinks like:
     events { // think about inheritance here...
        'rowclick': function (e, args) {

        },
        'list.load': function (e, args) {

        },
        'el.click': function () {
            // jQuery event
        }
     }
* make a function to init all the views.