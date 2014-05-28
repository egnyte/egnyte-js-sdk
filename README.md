Egnyte SDK
=============

## Features

This package contains:

 - a JavaScript wrapper on Egnyte Public API with methods for working with File System API and Link API 
 - a file picker implementation working on top of the File System API
 - a file picker helper to pick files from Egnyte without using the Public API
 
`dist/` contains two builds:
 - `dist/egnyte.js` (21KB) is the complete functionality
 - `dist/slim.js` (10KB)is only the API wrapper

## Usage

See `docs/` or explore:

[API](src/docs/api.md)  
[File picker](src/docs/filepicker.md)  

   
## Tests

To run tests for the API you need to have access to the Public API first.
Create a file `spec/conf/apiaccess.js` with the following ocntent:

    egnyteDomain = "https://YOURDOMAIN.egnyte.com";
    APIToken = "YOURACCESSTOKEN";

`YOURACCESSTOKEN` is not the API key. You need to obtain the access token using your key as described in authentication section of Egnyte Public API docs.

Or you can run `grunt serve` and open `https://127.0.0.1:9999/examples/request_token.html` and go through the flow in the example.