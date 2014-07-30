# Egnyte Public API wrapper

|Sections|
| --- |
|[Init and Authorize](#initialize-and-connect-to-api)|
|[FileSystem API](#file-system-api-helpers)|
|[Link API](#link-api-helpers)|
|[Error handling](#error-handling)|

## Introduction

Egnyte SDK contains methods helping the developer with authorization, FileSystem API and Link API.

For more details on the API behind this JavaScript wrapper, visit [Public API documentation](https://developers.egnyte.com/docs)

Need API key? [Get API access here!](https://developers.egnyte.com/member/register)



## Initialize and connect to API

Initialize Egnyte SDK to use API with your key

```javascript
var egnyte = Egnyte.init("https://mydomain.egnyte.com", {
        key: YOURAPIKEY,
        mobile: true      //optional, changes login prompt to mobile friendly
    });
```

Request an access token

Call any of the `API.auth.requestToken*` methods.

### Initialize with token

If the token is already stored securely and there is no need to request it, it can be passed as initial configuration.

```javascript
var egnyte = Egnyte.init("https://mydomain.egnyte.com", {
        token: YOURAPITOKEN
    });
```

### User Quota (queries per second) handling

The API has limits for the number of queries a single user can make. If one of the users of your app performs too many actions, the API endpoint will return `HTTP403` with the "Developer over QPS" error.

The SDK transparently handles user quota by default. All calls have a default retry policy - if the API responds with "Developer over QPS" error, a retry is scheduled to run after 1 second. A warning is logged to the browser's console to help spotting the problem.

`API.auth.promiseRequest` and all the `API.storage.*` and `API.link.*` methods have a built-in mechanizm to delay calls that are made too fast, to avoid getting "Developer over QPS" errors at all. The delays are based on a declared QPS value. Most API keys have a 2 queries per second limit on users.

To set your query per second quota to something else than 2, initialize with `QPS` option

```javascript
var egnyte = Egnyte.init("https://mydomain.egnyte.com", {
        key: YOURAPIKEY,
        mobile: true,
        QPS: 2
    });
```

To entirely disable the quota handling set `handleQuota` option to `false` 


## Authorization methods


Method | Arguments | Description
--- | --- | ---
API.auth.isAuthorized | | Returns `boolean` true if a token is present
API.auth.setToken | `token` | Accepts a token string. New token overwrites the previous one
API.auth.requestTokenReload | `success_callback`, `denied_callback` | Reloads the page to perform authorization and calls the appropriate callback synchronously once the token is available or denied after reload. (see examples/request_token.html)
API.auth.requestTokenPopup | `success_callback`, `denied_callback`,`postmessage_sender` | Opens a new window or tab for the user. `postmessage_sender` is a fully qualified HTTPS URL to a copy of `dist/resources/token.html`. (see examples/request_token_popup.html)
API.auth.requestTokenIframe | `node`, `success_callback`, `denied_callback`, `path` | Performs authorization in an iframe instead of reloading the page. Iframe is appended to `node`. `path` argument is used as a redirect target for log-in prompt completion. `path` defaults to current window location. (see examples/request_token_iframe.html)
API.auth.authorizeXHR | `XHR object` | Adds authorization header to given XHR object
API.auth.getHeaders | | Returns headers definition to add as headers to eg. jQuery.ajax options
API.auth.getToken | | Returns the token string
API.auth.dropToken | | Forgets the current token
API.auth.getUserInfo | | Returns a promise that resolves to user info object

### Requesting tokens

`API.auth.requestToken` method loads the log-in prompt in current window. Once the user accepts or denies access, current page is loaded again and the whole code on it runs again. This time `API.auth.requestToken` will find the token as it was appended to URL and runs the success callback.

```javascript
API.auth.requestTokenReload(function(){
    //can work with API
},function(){
    //request denied
});
```

`API.auth.requestTokenPopup` method opens a window or tab with the log-in prompt. Once the user accepts or denies access, `postmessage_sender` is loaded in the window and the token is transmited to our main window. `postmessage_sender` must be a HTTPS URL pointing to a document, that calls `API.auth._postTokenUp()`

```javascript
API.auth.requestTokenPopup(
    function(){
        //can work with API
    },
    function(){
        //request denied
    },
    "https://127.0.0.1:9999/dist/resources/token.html"
);
```

`API.auth.requestTokenIframe` method appends an iframe to given `node` and opens the log-in prompt in there. Once the user accepts or denies access, current page is loaded again in the iframe and the token is extracted from it. It is recommended to pass `path` to `API.auth.requestTokenIframe` to redirect to an empty page, not the current one. the `path` should be an absolute path in the current domain (starting with /).

```javascript
API.auth.requestTokenIframe(
    document.body,
    function(){
        //can work with API
    },
    function(){
        //request denied
    },
    "/empty.html"
);
```

### Token failure handling

If you pass a stored token to your new Egnyte instance and the token is invalid, you should initialize again and request a new token.
To ease the handling of this situation you can pass `onInvalidToken` option containing a function that will be called instead of error callback whenever your acces token turns out invalid.

```javascript
var egnyte = Egnyte.init("https://mydomain.egnyte.com", {
        token: YOURAPITOKEN,
        key: YOURAPIKEY,
        mobile: true,
        onInvalidToken: function(){
            //try getting new
            egnyte.API.auth.requestTokenPopup(
                function(){
                    //can work with API
                },
                function(){
                    //request denied
                },
                "https://127.0.0.1:9999/dist/resources/token.html"
            );
            //get the app working again
        }
    });
```

## Making manual requests


Method | Arguments | Description
--- | --- | ---
API.manual.getEndpoint | | Returns the public API endpoint root URL
API.manual.sendRequest | `options`, `callback` | Sends an authorized request and calls the callback when finished (see examples below); Returns the raw XHR object; Retries the call if server responds with "Developer over QPS"
API.manual.promiseRequest | `options` | Performs the same task as `sendRequest` but returns a simple promise instead of calling the callback (see examples below); Automatically delays a call if it could go over QPS quota; Retries the call if server responds with "Developer over QPS"

### How to make a request

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
egnyte.API.manual.sendRequest({
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
egnyte.API.manual.promiseRequest({
        ...
    }).then(function (response, body) {
        //response is the XHR object
        //body contains response JSON converted to object
    }).fail(function(error, response, body){
        //handle the error 
    });
```

```javascript
egnyte.API.manual.promiseRequest({
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
API.storage.download | `path`, `isBinary` | Resolves to XHR object for the download file content query, from which response can be extracted and interpreted as needed. `xhr.responseType` is set to `arraybuffer` if `isBinary` is true (to get the gist of what this method can do take a look at `examples/filepicker_usecase.html`)
API.storage.createFolder | `path` | Creates a folder at the given path, resolves to `{path:"<the given path>"` 
API.storage.storeFile | `path`, `Blob_object` | Uploads a file and stores at the given path, resolves to `{path:"...",id:"<version ID>"}` (see below for details on Blob)
API.storage.move | `path`,  `new path` | Moves a file or folder to new path, resolves to `{path:"...", oldPath:"..."}`
API.storage.copy | `path`,  `new path` | Copies a file or folder to new path, resolves to `{path:"...", oldPath:"..."}`
API.storage.rename | `path`,  `new path` | alias for move
API.storage.remove | `path` | Deletes a file or folder 
API.storage.removeFileVersion | `path`, `version_ID` | Deletes a version of a file 

### Storing a file

Storing a file requires a `Blob` compatible object. It can be created manually using the browser's `Blob` constructor or `BlobBuilder`. A file input in a form can also produce a blob: `fileInputNode.files[0]` is a `File` object, which actually extends `Blob`.

To aid working with blobs cross-browser we recommend https://github.com/eligrey/Blob.js (a copy available in this repo in src/vendor/blob.js)


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

The `storeFile` method uses `FormData` constructor; documentation and detailed browser support can be found here: https://developer.mozilla.org/en-US/docs/Web/API/FormData

### Downloading a file

It is possible to download a file to memory in modern browsers. A proof of concept of that can be found in `examples/filepicker_usecase.html`


## Link API helpers

All API helpers return promises.

Method | Arguments | Description
--- | --- | ---
API.link.createLink | `link_setup` | Creates a link, resolves to the new link description object 
API.link.removeLink | `link_ID` | Destroys the link of given id
API.link.listLink | `link_ID` | Resolves to link description object
API.link.listLinks | `filters` | Resolves to a list of links, narrows the list down by filters given
API.link.findOne | `filters` | Resolves to a link description object of a link that matches the filters. (the result of `listLink` called on first of the ids returned by `listLinks`) 

### Creating a link

To create a link with `API.link.createLink` method, a setup object is required. 


Name | | Description
--- | --- | ---
path | required | full absolute path to the target file or folder. If target is a file then include the filename.
type | required | "file" or "folder"
accessibility | required |"anyone", "password", "domain", "recipients"
recipients | optional  | list of recipients of the link (email addresses). Only required if the link will be sent via email by Egnyte. 
send_email | optional  | if True, send the link out via email. In this case, the recipients parameter must be specified. Defaults to false. 
message | optional  | personal message to be sent in link email. 
copy_me | optional  | if True, send a copy of the link message to the link creator. Only applies if send_email is True. Defaults to false. 
notify | optional  | if True send notification emails to link creator when link is accessed. Defaults to false. 
link_to_current | optional  | if True, link to the current version of the file. Otherwise link to latest version of file. Only applies to file links, not folder links. Defaults to false. 
expiry_date | optional  | the expiry date for the link. Date must be in the future. If expiry_date is specified then expiry_clicks cannot be set. 
expiry_clicks | optional  | the number of clicks the link is valid for. Value must be between 1 and 10, inclusive. If expiry_clicks is specified then expiry_date cannot be set. 
add_filename | optional  | if True then the filename will be appended to the end of the link. Only applies to file links, not folder links. Defaults to false. 


accessibility options:
 - "anyone" – accessible by anyone with link
 - "password" – accessible by anyone with link who knows password (password is generated and returned from the call)
 - "domain" – accessible by any domain user (login required)
 - "recipients" – accessible by link recipients, who must be domain users (login required)
 
_Example_
 
```javascript
egnyte.API.link.createLink({
        path: "<file path>",
        type: "file",
        accessibility: "password"
    }).then(function (newLink) {
        newLink.links[0].id; //link ID, useful when listing or removing link
        newLink.links[0].url; //the URL of your link
        newLink.password; //autogenerated password to enter the link
    });
```

_Full link description example_

```javascript
{
    "links": [{
        "id": "yshJEeonvt",
        "url": "https://acme.egnyte.com/h-s/20140528/yshJEeonvt",
        "recipients": []
    }],
    "path": "/Private/acme/filename.png",
    "type": "file",
    "accessibility": "password",
    "notify": false,
    "password": "xi3awtc3ZphJ",
    "link_to_current": false,
    "creation_date": "2014-05-28",
    "send_mail": false,
    "copy_me": false
}

```

### Listing links

`API.link.listLinks` and `API.link.findOne` methods accept filters definition. All filters are optional.


Name | Description
 --- | ---
path | list links to this file or folder (full absolute path)
username | list links created by this user
created_before | list links created before this date
created_after | list links created after this date
type | show links of this type (“file” or “folder”)
accessibility | show links with this accessibility (“anyone”, “password”, “domain” or “recipients”)
offset | start at this link (0 = first link). If not specified, defaults to 0.
count | send this number of links. If not specified, all links will be sent.

_Example response to listLinks_

```javascript
{
   "total_count": 10,
   "offset": 5,
   "count": 3,
   "ids": ["47b774f66f344a67","56d35b2320d74948","426683f37dd64e41"]
}
```

## Browser support

The SDk overall supports IE8 and IE9, but due to certain limitations in their implementations of Cross Origin Resource Sharing some of the API methods cannot work. Those browsers will only handle reading and downloading data, moving items, creating folders, and all the link features.
Other limitations regarding domains are present as well. For details please refer this Microsoft publication: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx


## Error handling

All errors are returned in common format of a JavaScript error enhanced with additional fields

Name |  Description
--- |  ---
statusCode | HTTP status code if error comes from the server. 0 if request failed before being sent. `undefined` if error occured in the source of this SDK
message | readable error message text
response | If the query happened, error.response is the xhr response object
body | If the query happened, error.body contains the body of the response

The "Developer over QPS" error is not returned at all, instead a call is repeated when appropriate.