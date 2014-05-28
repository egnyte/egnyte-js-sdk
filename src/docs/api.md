# Egnyte Public API wrapper

For more details on the API behind this JavaScript wrapper, visit [Public API documentation](https://developers.egnyte.com/docs)

## Initialize and connect to API

Initialize Egnyte SDK to use API with your key

```javascript
var egnyte = Egnyte.init("http://mydomain.egnyte.com", {
        key: YOURAPIKEY,
        mobile: true      //optional, changes login prompt to mobile friendly
    });
```

Request an access token

```javascript
egnyte.API.auth.requestToken(function() {
        var accessToken = egnyte.API.auth.getToken();
    });
```

__Warning__: `API.auth.requestToken` will cause a page reload to let the user authorize the application to use the API.

### Initialize with token

If the token is already stored securely and there is no need to request it, it can be passed as initial configuration.

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

## Link API helpers

All API helpers return promises.

Method | Arguments | Description
--- | --- | ---
API.link.createLink | `link_setup` | Creates a link, resolves to the new link description object 
API.link.removeLink | `link_ID` | Destroys the link of given id
API.link.listLink | `link_ID` | Resolves to link description object
API.link.listLinks | `filters` | Resolves to a list of links, narrows the list down by filters given

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

`API.link.listLinks` method accepts filters definition. Filters are optional.


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

_Link list example_

```javascript
{
   "total_count": 10,
   "offset": 5,
   "count": 3,
   "ids": ["47b774f66f344a67","56d35b2320d74948","426683f37dd64e41"]
}
```