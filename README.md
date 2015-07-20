Egnyte JavaScript SDK
=============

## Features

This package contains:

 - a JavaScript wrapper on Egnyte Public API with methods for working with File System, Links, Permissions and more 
 - a file picker implementation working on top of the File System API
 

## Installation

### Node.js
`npm install egnyte-js-sdk`

### Browser

Include one JavaScript file.

`dist/` contains two builds:

 - `dist/egnyte.js` is the complete functionality (with UI)
 - `dist/slim.js` is only the API wrapper

_File sizes_

```
dist/egnyte.min.js minified: ~50 kB gzipped: ~11 kB
dist/slim.min.js minified: ~30 kB gzipped: ~6 kB
```

To use the SDK, just add the script to your app's HTML document.

## Usage

See `docs/` locally or explore documentation in markdown format:


### Table of contents

* [Methods on top of Egnyte Public API](./src/docs/api.md)  
* [API usage notes for node.js](./src/docs/nodejs.md)
* [File picker widget](./src/docs/widgets.md)  
* [UIntegrate plugin](./src/docs/uintegrate.md)  
* [Installation and tests](./src/docs/installation.md)  



If you support IE8 or IE9 see [Legacy browsers support](./src/docs/ie8or9.md) to enable the cross-origin forwarder.

The `examples/` folder could also be helpful.

## Browser support

Firefox, Chrome, Opera, Safari 5+, IE10+ and multiple mobile browsers.

All browsers that support Cross Origin Resource Sharing are supported. See: [CORS support table](http://caniuse.com/#feat=cors)

The SDK code overall supports IE8 and IE9, but due to certain limitations in their implementations of Cross Origin Resource Sharing requests to Egnyte Public API cannot be authorized. 

This SDK includes tools to bring support to IE8 and IE9, see [Legacy browsers support](./src/docs/ie8or9.md)


## License

Apache2 License

http://opensource.org/licenses/Apache-2.0
