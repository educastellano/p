# API Reference

-- coming --

* [P.Event](https://github.com/educastellano/p/tree/master/src#pevent)
* [P.Model](https://github.com/educastellano/p/tree/master/src#pmodel)
* [P.List](https://github.com/educastellano/p/tree/master/src#plist)
* [P.View](https://github.com/educastellano/p/tree/master/src#pview)
* [Persistence Strategies](https://github.com/educastellano/p/tree/master/src#persistence-strategies)
* [Inheritance and Helpers](https://github.com/educastellano/p/tree/master/src#inheritance-and-helpers)


## P.Event
<sup>(inherits Object)</sup>  

### Methods
* ### trigger( event, [args] )
Triggers a custom event

	* #### Parameters
		* event: String  
		Name of the event to trigger  
		
		* args: Object  
		Custom arguments to be passed in the callback functions
		
	* #### Returns
	undefined

* ### on( event, func, [scope] )
Binds a callback function to an object

	* #### Parameters	
		* event: String  
		Name of the event to listen  
		
		* func: Function  
		Callback function
		
		* scope: Object  
		The scope ('this' reference) in which the callback function is executed
		  
	* #### Returns  
	undefined

* ### off( event, func )
Unbinds the specified callback function from an object.

	* #### Parameters
		* event: String  
		Name of the event to stop listen  
		
		* func: Function  
		Callback function
			
	* #### Returns  
	undefined

## P.Model
<sup>(inherits P.Event)</sup>  

### Attributes

* ### idAttr
blabla

* ### root
blabla

### Methods

* ### get( attr )
blabla

	* #### Parameters	
	* #### Returns

* ### set( attr, value, options )
blabla

	* #### Parameters	
	* #### Returns

* ### setValues( values, options )
blabla

	* #### Parameters	
	* #### Returns
	
* ### getId( )
blabla

	* #### Parameters	
	* #### Returns

* ### getRespAttr( data )
blabla

	* #### Parameters	
	* #### Returns

* ### toDataAPI( data, method )
blabla

	* #### Parameters	
	* #### Returns

* ### create( attr )
blabla

	* #### Parameters	
	* #### Returns

* ### save( options )
blabla

	* #### Parameters	
	* #### Returns

* ### fetch( options )
blabla

	* #### Parameters	
	* #### Returns

* ### destroy( options )
blabla

	* #### Parameters	
	* #### Returns


## P.List 
<sup>(inherits P.Event)</sup>  

### Methods

* ### getRespData( resp )
blabla

	* #### Parameters	
	* #### Returns

* ### onModelChange( e, args )
blabla

	* #### Parameters	
	* #### Returns

* ### create( )
blabla

	* #### Parameters	
	* #### Returns

* ### load( options )
blabla

	* #### Parameters	
	* #### Returns

* ### clear( )
blabla

	* #### Parameters	
	* #### Returns

* ### add( mode, options )
blabla

	* #### Parameters	
	* #### Returns

* ### remove( model, options )
blabla

	* #### Parameters	
	* #### Returns

* ### removeByCid( cid, options )
-- not implemented --

	* #### Parameters	
	* #### Returns

* ### removeById( id, options )
blabla

	* #### Parameters	
	* #### Returns

* ### removeByAttr( attr, value, options )
blabla

	* #### Parameters	
	* #### Returns

* ### getAt( idx )
blabla

	* #### Parameters	
	* #### Returns

* ### getByCid( cid )
blabla

	* #### Parameters	
	* #### Returns

* ### getById( id )
blabla

	* #### Parameters	
	* #### Returns

* ### getBy( prop, value )
blabla

	* #### Parameters	
	* #### Returns

* ### exists( id )
blabla

	* #### Parameters	
	* #### Returns

* ### count( )
blabla

	* #### Parameters	
	* #### Returns



## P.View
<sup>(inherits P.Event)</sup>  

### Methods

* ### init( )
blabla

	* #### Parameters	
	* #### Returns

* ### viewModel( )
blabla

	* #### Parameters	
	* #### Returns

* ### create( options )
blabla

	* #### Parameters	
	* #### Returns

* ### destroy( )
blabla

	* #### Parameters	
	* #### Returns



## Persistence strategies

## Inheritance and Helpers