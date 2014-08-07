Egnyte JavaScript SDK
=============

## Features

This package contains:

 - a JavaScript wrapper on Egnyte Public API with methods for working with File System API and Link API 
 - a file picker implementation working on top of the File System API
 - a file picker helper to pick files from Egnyte without using the Public API
 

## Installation

`dist/` contains two builds:

 - `dist/egnyte.js` is the complete functionality
 - `dist/slim.js` is only the API wrapper

_File sizes_
```
dist/egnyte.min.js minified: 38.6 kB gzipped: 8.75 kB
dist/slim.min.js minified: 20.23 kB gzipped: 4.6 kB

```

To use the SDK, just add the script to your app's HTML document.

## Usage

See `docs/` or explore:

[API](src/docs/api.md)  
[File picker](src/docs/filepicker.md)  
[Installation and tests](src/docs/installation.md)  

If you support IE8 or 9 see [Legacy browsers support](src/docs/ie8or9.md) to enable the cross-origin forwarder.

The `examples/` folder could also be helpful.

To use the API in node.js see [Usage notes for node.js](src/docs/nodejs.md)


## License

Apache2 License

http://opensource.org/licenses/Apache-2.0
