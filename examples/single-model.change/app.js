
(function (root) {
    'use strict';

    // init
    root.App = {};
    root.App.ref = {};
    P.persist = P.persistLocalStorage;

    // models    
    App.Person = P.inherits(P.Model, {
        $name: 'Person'
    });

    // views
    App.PersonView = P.inherits(P.View, {

        handlers: {
            'model.change': function onModelChange(e, args) {
                this.change(args.model, args.attr, args.value);
            }
        },
        
        change: function (model, attr, value) {
            this.el.find('.' + attr).html(value);
        }

    });

    // app
    var person = App.ref.person = App.Person.create();   // or Object.create(App.Person);
    var view = App.PersonView.create({
        el: $('#person0'),
        model: person
    });

    person.set('name', 'joanet');
    person.set('email', 'joanet@p.com');

    // > play with it in the console:
    //     App.ref.person.set('name', 'myname');
    //     App.ref.person.set('email', 'myemail');

})(this);