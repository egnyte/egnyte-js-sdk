# UIntegrate plugin for simple UI Integration Framework interaction

## Installation

Go to `dist/` and pick one of the versions:

- `dist/uintegrate.js` - UIntegrate interaction functionality (documented below)

It will merge with the global Egnyte namespace when available.

When using CommonJS dependency management, you can require the plugin:

- `var Egnyte = require("egnyte-js-sdk/plugins/UIntegrate")`

## Usage

```javascript
Egnyte.appInit(function(uint){
    //use the uint object to interact with Egnyte UI and/or APIs
})
```

`uint` object:


field | type | description
 --- | --- | ---
data| object | data provided by the invocation, must contain at least the `domain` field - egnyte domain you can pass to `Egnyte.init(uint.data.domain, options)`
reload | function() | call this function to make Egnyte UI reload the current folder (after you make file operations etc.)
error | function(message) | inform Egnyte UI that your app had an error. The app is closed and a notification containing the `message` shows.
complete | function(message) | inform Egnyte UI that your app finished what it was doing and it can be closed. `message` will be shown to the user as a notification. Ending the app by just calling `window.close()` is not recommended and will not close the app if it works in an iframe.


In CommonJS/Node if you already loaded the SDK to the Egnyte variable, just use a separate reference for the plugin:


```javascript
var Egnyte = require("egnyte-js-sdk")
var UIntegrate = require("egnyte-js-sdk/plugins/UIntegrate")
UIntegrate.appInit(function(uint){
    //use the uint object to interact with Egnyte UI and/or APIs
})
```

## Technical details

UI Integration Framework uses `postmessage` for communication.
To make sure other messages will not get mixed with others, it uses a specific format for them. If your app is using `postmessage` to receive JSON data, make sure you ignore non-JSON messages like this:

```javascript
try {
    JSON.parse(message);
}catch(e){
    //it failed to parse, please ignore
}
```
