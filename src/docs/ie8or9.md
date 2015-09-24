# Legacy browsers support

IE8 and IE9 are mostly supported by this SDK. Even though they are incapable of making an authorized cross-origin request to the API endpoint.

To get them to work, you need to enable forwarder by setting `oldIEForwarder` option to true.

The object returned as `response` is an object with keys: `body`,`headers`,`statusCode`,`statusText` instead of a full XMLHttpRequest object.

The API call is acheived by opening a copy of the SDK in an iframe on the same domain as the API endpoint it uses and forwarding all calls to the iframe. The forwarding is initiated automatically when an incapable browser is detected.

The content of the iframe is loaded from a location in the Egnyte domain being used. The location is defined by `options.forwarderAddress`. The address will change with significant modifications to the SDK signature, you'll be able to switch between versions with this option. For now, the default will suffice.

Every call is being sent with the access token, so the security of this solution depends on IE's `window.postmessage` implementation security.


## What will not work?

`api.manual.sendRequest` and `api.manual.promiseRequest` are not forwarded, so they cannot be used.

Uploading files or downloading anything containing binary data will obviously not work in IE8 nor IE9. It is possible to work with text files content to some extent.
