# Egnyte Public API

## Initialize and connect to API

Initialize Egnyte SDK to use API with your key

```javascript
var egnyte = Egnyte.init("http://mydomain.egnyte.com", {
        key: YOURAPIKEY,
        mobile: true      //optional, changes login prompt to mobile friendly
    });
```

Run authentication to get an access token

```javascript
egnyte.API.auth.requestToken(function() {
        var accessToken = egnyte.API.auth.getToken();
    });
```

__Warning__: `API.auth.requestToken` will cause a page reload to let the user 

### Initialize with token

If the token is stored securely and there is no need to request it, it can be passed as initial configuration.

```javascript
var egnyte = Egnyte.init("http://mydomain.egnyte.com", {
        token: YOURAPITOKEN
    });
```

## Authorization methods


Method | Arguments | Description
--- | --- | ---
API.auth.isAuthorized | | Returns `boolean` true if a token is present
API.auth.setToken | `token` | Accepts a token string. New token overwrites the previous one
API.auth.requestToken | `callback` | Performs authorization and calls the callback the moment the token is available
API.auth.authorizeXHR | `XHR object` | Adds authorization header to given XHR object
API.auth.getHeaders | | Returns headers definition to add as headers to eg. jQuery.ajax options
API.auth.getToken | | Returns the token string
API.auth.dropToken | | Forgets the current token
API.auth.getEndpoint | | Returns the public API endpoint root URL
API.auth.sendRequest | `options`,`callback` | Sends an authorized request and calls the callback when finished (see examples below)
API.auth.promiseRequest | `options` | Performs the same task as `sendRequest` but returns a simple promise instead of calling the callback (see examples below)

### Handling requests

_Request options_

Name | Type | Description
--- | --- | ---
url | String | The URL to query
params | Map | Set of query params, optional
sync | Boolean | Make a synchronous call, optional
method | String | Request method, optional, defaults to GET
timeout | Number | Set a timeout for the request, optional, defaults to 5s
headers | Map | Request headers, optional
body | String | Body of the request for POST and PUT, optional
json | Object | JSON serializable object to send as body, adds correct content-type too, optional

_Examples_

```javascript
egnyte.API.auth.sendRequest({
        url:"https://..." //full URL address
        params:{ //query params to be added after the ? at the end of url 
            "queryparam":"param-value"
        },
        headers:{}, //any headers to add to the query, Authorization header is added to this set by default
        method: "POST",
        body: "some content"
    }, function (error, response, body) {
        if(error === null){
            //response is the XHR object
            //body contains response JSON converted to object
        }else{
            //handle the error or rethrow
        }
    });
```


```javascript
egnyte.API.auth.promiseRequest({
        ...
    }).then(function (response, body) {
        //response is the XHR object
        //body contains response JSON converted to object
    }).error(function(error, response, body){
        //handle the error 
    });
```

```javascript
egnyte.API.auth.promiseRequest({
       ...
    }).then(function (response, body) {
        //response is the XHR object
        //body contains response JSON converted to object
    },function(error, response, body){
        //handle the error 
    });
```

## File System API helpers

All API helpers return promises.

Method | Arguments | Description
--- | --- | ---
API.storage.exists | `path` | Resolves to true if file exists and false if it doesn't, rethrows errors if different than 404
API.storage.get | `path` | Resolves to file or folder definition object
API.storage.download | `path` | Resolves to XHR response for the download file content query, from which body can be extracted and interpreted as needed
API.storage.createFolder | `path` | Creates a folder at the given path, resolves to `{path:"<the given path>"` 
API.storage.storeFile | `path`, `Blob_object` | Uploads a file and stores at the given path, resolves to `{path:"...",id:"<version ID>"}` (see below for details on Blob)
API.storage.move | `path`,  `new path` | Moves a file or folder to new path, resolves to `{path:"...", oldPath:"..."}`
API.storage.rename | `path`,  `new path` | alias for move
API.storage.remove | `path` | Deletes a file or folder 
API.storage.removeFileVersion | `path`, `version_ID` | Deletes a version of a file 

### Storing a file

Storing a file requires a `Blob` compatible object. It can be created manually using the browser's `Blob` constructor of `BlobBuilder`. A file input in a form can also produce a blob: `fileInputNode.files[0]` is a `File` object, which actually extends `Blob`.

To aid working with blobs cross-browser we recommend https://github.com/eligrey/Blob.js (a copy available in this repo in src/vendor/blob.js)

The `storeFile` method uses `FormData` constructor, documentation and detailed browser support can be found here: https://developer.mozilla.org/en-US/docs/Web/API/FormData

_Example_


```javascript
$(".myForm").on("submit",function(){

    var file = $("input.avatarfile")[0].files[0]

    egnyte.API.storage.storeFile("/Private/mydata/avatar.png", file)
       .then(function (response, body) {
            //upload successful
        },function(error, response, body){
            //handle the error 
        });
    return false;
});

```

## Link API helpers