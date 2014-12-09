Egnyte JavaScript SDK
=============

## Features

This package contains:

 - a JavaScript wrapper on Egnyte Public API with methods for working with File System, Links, Permissions and more 
 - a file picker implementation working on top of the File System API
 

## Installation

`dist/` contains two builds:

 - `dist/egnyte.js` is the complete functionality (with UI)
 - `dist/slim.js` is only the API wrapper

_File sizes_

```
dist/egnyte.min.js minified: 46.75 kB gzipped: 10.15 kB
dist/slim.min.js minified: 29.17 kB gzipped: 6.15 kB
```

To use the SDK, just add the script to your app's HTML document.

## Usage

See `docs/` or explore:

[API](src/docs/api.md)  
[File picker and other UI widgets](src/docs/widgets.md)  
[Installation and tests](src/docs/installation.md)  

If you support IE8 or 9 see [Legacy browsers support](src/docs/ie8or9.md) to enable the cross-origin forwarder.

The `examples/` folder could also be helpful.

To use the API in node.js see [Usage notes for node.js](src/docs/nodejs.md)


## License

Apache2 License

http://opensource.org/licenses/Apache-2.0
