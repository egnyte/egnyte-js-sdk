#Installation

`dist/` contains two builds:
 - `dist/egnyte.js` (~32KB minified) is the complete functionality
 - `dist/slim.js` (~10KB minified) is only the API wrapper (no filepicker)
 
both of them available in minified versions (recommended)

To use the SDK, just add the script to your app's HTML document.

```html
<script src="egnyte.min.js"></script>
```

After that, all SDK functionalities are available via global `Egnyte` constructor.

If you wish to use filepicker with fonts matching main Egnyte UI, add `Open Sans` font too:

```html
<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600' rel='stylesheet' type='text/css'>
<script src="egnyte.min.js"></script>
```  

#Building and dependencies

To build the project and run tests `nodeJS` is required in your system.

Install grunt comandline tools:

    npm install -g grunt-cli

Install all dependencies:

    npm install .

Run build and tests (for integration tests setup see below)

    grunt
    

    
Run localhost server at https://127.0.0.1:9999/

    grunt serve



##Tests setup

To run tests for the API you need to have access to the Public API first.
Create a file `spec/conf/apiaccess.js` with the following content:

    egnyteDomain = "https://YOURDOMAIN.egnyte.com";
    APIToken = "YOURACCESSTOKEN";

`YOURACCESSTOKEN` is not the API key. 

You need to obtain the access token using your key and `requestToken` method or as described in authentication section of [Egnyte Public API docs](http://developers.egnyte.com/docs). 

But the easiest way at first is to run `grunt serve` and open https://127.0.0.1:9999/examples/request_token.html and go through the flow in the example to get a token.