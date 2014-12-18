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

See `docs/` locally or explore [documentation in markdown format](src/docs/index.md)  

## License

Apache2 License

http://opensource.org/licenses/Apache-2.0
