# Egnyte JavaScript SDK for the browser and node

## Table of contents

* [Methods on top of Egnyte Public API](./api.html)  
* [API usage notes for node.js](./nodejs.html)
* [File picker widget](./widgets.html)  
* [UIntegrate plugin](./uintegrate.html)  
* [Installation and tests](./installation.html)  



If you support IE8 or IE9 see [Legacy browsers support](./ie8or9.html) to enable the cross-origin forwarder.

The `examples/` folder could also be helpful.

## Browser support

Firefox, Chrome, Opera, Safari 5+, IE10+ and multiple mobile browsers.

All browsers that support Cross Origin Resource Sharing are supported. See: [CORS support table](http://caniuse.com/#feat=cors)

The SDK code overall supports IE8 and IE9, but due to certain limitations in their implementations of Cross Origin Resource Sharing requests to Egnyte Public API cannot be authorized.

This SDK includes tools to bring support to IE8 and IE9, see [Legacy browsers support](./ie8or9.html)
