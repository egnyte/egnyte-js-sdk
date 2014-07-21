#Legacy browsers support

IE8 and IE9 are mostly supported by this SDK. Even though they are incapable of making an authorized cross-origin request to the API endpoint.

The API call is acheived by opening a copy of the SDK in an iframe on the same domain as the API endpoint it uses and forwarding all calls to the iframe.

Every call is being sent with the access token, so the security of this solution depends on IE's `window.postmessage` implementation security. 

Uploading files or downloading anything containing binary data will obviously not work in IE8 nor IE9. It is possible to work with text files content to some extent.
