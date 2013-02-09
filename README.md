__IMPORTANT__: There is not any stable release of this lib yet. Coming soon ;)

P
=
P is a tiny MV* library to help you structuring your apps. 

It's strongly based in other frameworks such as Backbone, but its aim is to be a simple library rather than a framework.


Features
========

* Simple
* Pure prototypal inheritance.
* Nothing else than a MV* library

Install
=======

Get the [compiled and minified version](https://raw.github.com/educastellano/p/master/lib/p-0.0.1.min.js) and include it to your application.

Example
=======


Changelog
=========
### 0.0.2
* P.Model.getRespAttr fix
* P.List.exists added
* P.List.add don't add if exists. Also returns the model.
* P.View inherits P.Event
* P.View.init handler onModelDestroy added
* P.View.create added
* P.View.destroy added
* P.View.viewModel method added. There is now the possibility to define viewModels through defViewModel.
* P.View.init onModelChange default method to provide data binding

### 0.0.1

* P.List.loadNext removed
* P.List.length changed to P.List.count
* P.persistLocalStorage and P.persistREST added. 
* P.List.load using P.persist. Bugfixes in P.persistREST.
* P.List.root empty by default.
* P.List.getAt added
* P.fn.uuid function added
