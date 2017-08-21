# Installation

## Browser

`dist/` contains two builds:
 - `dist/egnyte.js` is the complete functionality
 - `dist/slim.js` is only the API wrapper (no filepicker or other UI)
 
both of them available in minified versions (recommended)

To use the SDK, just add the script to your app's HTML document.

```html
<script src="egnyte.min.js"></script>
```

After that, all SDK functionalities are available via global `Egnyte` constructor.

To show Google Drive icons in the filepicker for files coming from Google Drive include the `googicons.css` from `dist/resources/`


## Node.js

```
npm install --save egnyte-js-sdk
```

use:

```javascript
var Egnyte = require('egnyte-js-sdk');
```

# Building and dependencies

To build the project and run tests `node.js` is required in your system.

Install grunt comandline tools:

    npm install -g grunt-cli

Install all dependencies:

    npm install .

Run build and tests (for integration tests setup see below)

    grunt
    

    
Run localhost server at https://127.0.0.1:9999/

    grunt serve



## Tests setup

To run tests for the API you need to have access to the Public API first.
Create a file `spec/conf/apiaccess.js` based on the `spec/conf/apiaccess_template.js` file.

```javascript
egnyteDomain = "https://YOURDOMAIN.egnyte.com";
APIToken = "YOURACCESSTOKEN";

//optionally
APIKey = "12345" //API key for password grant
APIUsername = "user";
APIPassword = "foo";
APIKeyImplicit = "9876543" //API key for implicit grant
```

`YOURACCESSTOKEN` is not the API key. 

You need to obtain the access token using your key and `requestToken` method or as described in authentication section of [Egnyte Public API docs](http://developers.egnyte.com/docs). 

But the easiest way at first is to run `grunt serve` and open https://127.0.0.1:9999/examples/request_token.html and go through the flow in the example to get a token.

Keys and user credentials are optional - tests checking authorization flows will not run without them.