# Egnyte Public API wrapper

|Sections|
| --- |
|[Init and Authorize](#initialize-and-connect-to-api)|
|[FileSystem API](#file-system-api-helpers)|
|[Link API](#link-api-helpers)|
|[Permissions API](#permissions-api-helpers)|
|[Search](#search)|
|[Events](#events)|
|[Impersonation](#impersonation)|
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
        scope: SCOPE_STRING //optional, scope value to send with token requests
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

### Set defaults for http requests to API

If you want to set some defaults for all requests (like request timeout) you can pass them to the init function:
```javascript
var egnyte = Egnyte.init("https://mydomain.egnyte.com", {
        requestDefaults: {
            timeout: 30000
        }
    });
```

Defaults are added to the set of options passed to `xhr`(in browser) or `request`(in node) module.

### User Quota (queries per second) handling

The API has limits for the number of queries a single user can make. If one of the users of your app performs too many actions, the API endpoint will return `HTTP403` with the "Developer over QPS" error.

The SDK transparently handles user quota by default. All calls have a default retry policy - if the API responds with "Developer over QPS" error, a retry is scheduled to run after 1 second. A warning is logged to the browser's console to help spotting the problem.

`API.manual.promiseRequest` and all the `API.storage.*` etc. methods have a built-in mechanizm to delay calls that are made too fast, to avoid getting "Developer over QPS" errors at all. The delays are based on a declared QPS value. Most API keys have a 2 queries per second limit on users.

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


Method | Arguments | Description | Restrictions
--- | --- | --- | ---
API.auth.isAuthorized | | Returns `boolean` true if a token is present
API.auth.setToken | `token` | Accepts a token string. New token overwrites the previous one
API.auth.requestTokenReload | `success_callback`, `denied_callback` | Reloads the page to perform authorization and calls the appropriate callback synchronously once the token is available or denied after reload. (see examples/request_token.html) | browser only
API.auth.requestTokenPopup | `success_callback`, `denied_callback`,`postmessage_sender` | Opens a new window or tab for the user. `postmessage_sender` is a fully qualified HTTPS URL to a copy of `dist/resources/token.html`. (see examples/request_token_popup.html) | browser only
API.auth.requestTokenIframe | `node`, `success_callback`, `denied_callback`, `path` | Performs authorization in an iframe instead of reloading the page. Iframe is appended to `node`. `path` argument is used as a redirect target for log-in prompt completion. `path` defaults to current window location. (see examples/request_token_iframe.html) | browser only
API.auth.requestTokenIframeWithPrompt | `node`, `success_callback`, `denied_callback`, `path` | Same as above, but will prompt for Egnyte domain address first. | browser only, not available in slim.js
API.auth.requestTokenByPassword | `username`, `password` | Performs authorization using login and password provided by the user and resolves to the access token. Using this auth method requires switching your API key settings to be an "internal application", which is only available for Egnyte partners. (Contact us if you need that) | node.js only
API.auth.authorizeXHR | `XHR object` | Adds authorization header to given XHR object| browser only
API.auth.getHeaders | | Returns headers definition to add as headers to eg. jQuery.ajax options|
API.auth.getToken | | Returns the token string|
API.auth.dropToken | | Forgets the current token|
API.auth.getUserInfo | | Returns a promise that resolves to user info object|

### Requesting tokens

`API.auth.requestToken` method loads the log-in prompt in current window. Once the user accepts or denies access, current page is loaded again and the whole code on it runs again. This time `API.auth.requestToken` will find the token as it was appended to URL and runs the success callback.

```javascript
API.auth.requestTokenReload(function(){
    //can work with API
},function(){
    //request denied
});
```

`API.auth.requestTokenPopup` method opens a window or tab with the log-in prompt. Once the user accepts or denies access, `postmessage_sender` is loaded in the window and the token is transmited to our main window. `postmessage_sender` must be a HTTPS URL pointing to a document, that calls `API.auth._postTokenUp()`, like the `token.html` file in `dist/resources`.

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
API.manual.sendRequest | `options`, `callback` | Sends an authorized request and calls the callback when finished (see examples below); Retries the call if server responds with "Developer over QPS"; Returns the raw XHR object in the browser and a `request` object in node.js
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

Anywhere a response object is returned (except IE8/9, see Legacy support page) it is an XMLHttpRequest object extended with `statusCode` field and `headers` object (so you don't have to query headers individually)

## File System API helpers

All API helpers return promises.

Method | Arguments | Description | Restrictions
--- | --- | --- | ---
API.storage.*identify(...)*.exists |`entryID(optional)` | Resolves to true if file exists and false if it doesn't, rethrows errors if different than 404. `entryID` is the identifier of the version of the file if the operation should be performed on a version|
API.storage.*identify(...)*.get | | Resolves to file or folder definition object.|
API.storage.*identify(...)*.download |`entryID(optional)` , `isBinary` | Resolves to XHR object for the download file content query, from which response can be extracted and interpreted as needed. `xhr.responseType` is set to `arraybuffer` if `isBinary` is true (to get the gist of what this method can do take a look at `examples/filepicker_usecase.html`). `entryID` is the identifier of the version of the file if the operation should be performed on a version | browser only
API.storage.*identify(...)*.getFileStream |`entryID(optional)` | Resolves to the response object of the API, with a paused data stream. This method also handles queueing and QPS limits transparently. | node.js only
API.storage.*identify(...)*.createFolder | | Creates a folder at the given path, resolves to `{path:"..."}` or fails if folder can't be created (also if it already exists) |
API.storage.*identify(...)*.storeFile | `Blob or Stream`, `mimeType (optional)`, `size (optional)`| Uploads a file and stores at the given path, resolves to `{path:"...",id:"<version ID>"}` (see below for details on Blob).   In the browser it accepts Blob, in node.js a stream should be passed as a second argument. | `size` argument only works in node.js
API.storage.*identify(...)*.streamToChunks | `Stream`, `mimeType (optional)`, `chunksize(optional)` | splits a stream in chunks and uses chunked upload to send it to Egnyte. Accepts path, stream, optional mime type and optional chunk size. Chunk size defaults to 10KB but it can be as much as 100MB if you know the file's big. Resolves to the same signature as `storeFile` and fails if any chunk failed to upload | node.js only
API.storage.*identify(...)*.move |  `new path` | Moves a file or folder to new path, resolves to `{path:"...", oldPath:"..."}`|
API.storage.*identify(...)*.copy |  `new path` | Copies a file or folder to new path, resolves to `{path:"...", oldPath:"..."}`|
API.storage.*identify(...)*.rename |  `new path` | alias for move|
API.storage.*identify(...)*.remove |`entryID(optional)` | Deletes a file or folder. `entryID` is the identifier of the version of the file if the operation should be performed on a version|
API.storage.*identify(...)*.removeFileVersion | `version_ID` | Deletes a version of a file, throws if version not provided (can't delete the whole file accidentally) |
API.storage.*identify(...)*.lock | `previous token`, `timeout` | Locks a file, resolves to `{path: "...", timeout:seconds,lock_token:"..."}`, timeout defaults to 3600, previous token has to be provided if file is already locked and the lock is supposed to be renewed or overriden |
API.storage.*identify(...)*.lock | `lock body` | Different syntax for locking - allows setting body fields directly `lock_token, lock_timeout, collaboration` |
API.storage.*identify(...)*.unlock |`token` | Unlocks a file if the token is the one with which the lock was claimed |


### Identification


Method | Argument
--- | --- 
API.*.path | full path to file, starting with /
API.*.fileId | group_id of the file
API.*.folderId | folder_id of the folder

### Storing a file - node.js


```javascript
var fileStream = fs.createReadStream('sample.txt')
egnyte.API.storage.path(pathFromRoot).storeFile(fileStream, "text/plain", 1105)
    .then(function(filemeta){
        //
    })

```

If the API responds with an error that you cannot store an empty file, it means you have to provide the `size` argument.

### Storing a file - in the browser

Storing a file requires a `Blob` compatible object. It can be created manually using the browser's `Blob` constructor or `BlobBuilder`. A file input in a form can also produce a blob: `fileInputNode.files[0]` is a `File` object, which actually extends `Blob`.

To aid working with blobs cross-browser we recommend https://github.com/eligrey/Blob.js (a copy available in this repo in src/vendor/blob.js)



```javascript
$(".myForm").on("submit",function(){

    var file = $("input.avatarfile")[0].files[0]

    egnyte.API.storage.path("/Private/mydata/avatar.png").storeFile(file, "image/png")
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

In node.js getFileStream resolves to a paused stream that has to be manually resumed when you're ready to accept its data.

```javascript
egnyte.API.storage.path(pathFromRoot).getFileStream()
    .then(function(pausedResponse){
        pausedResponse.pipe(whereverYouWant);
        pausedResponse.resume(); //Be sure to resume the paused stream
    });

```



## File notes API helpers

All API helpers return promises.

Method | Arguments | Description | Restrictions
--- | --- | --- | ---
API.notes.path(`path to file`).addNote | `note_text` | Adds a note on file, resolves to `{id:"note-id"}` |
API.notes.path(`path to file`).listNotes | `query_params` | Resolves to an object with pagination options and `notes` field containing a list. You can pass query params to set offset, limit etc. (refer to public API docs)|
API.notes.getNote | `note_id` | Resolves to a note object. |
API.notes.removeNote | `note_id` | Removes the note. |

In current Egnyte Public API version notes can be added only to files identified by path.

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
add_file | optional  | if True then the filename will be appended to the end of the link. Only applies to file links, not folder links. Defaults to false.


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



## Permissions API helpers

All API helpers return promises.

All the methods below can be scoped to users or groups.

Method | Arguments | Description
--- | --- | ---
API.perms.users| `users[]` | Returns `API.perms` instance scoped to a certain set of users.
API.perms.groups| `groups[]` | Returns `API.perms` instance scoped to a certain set of groups.
API.perms.*identify(...)*.allow | `accessLevel` | Sets certain permissions on the given folder for the users/groups it's scoped to. Second argument is one of "None", "Viewer", "Editor", "Full", "Owner"
API.perms.*identify(...)*.disallow|  | Sets permissions on the given folder to "None"  for the users/groups it's scoped to.
API.perms.*identify(...)*.allowView|  | Sets permissions on the given folder to "Viewer" for the users/groups it's scoped to.
API.perms.*identify(...)*.allowEdit|  | Sets permissions on the given folder to "Editor" for the users/groups it's scoped to.
API.perms.*identify(...)*.allowFullAccess|  | Sets permissions on the given folder to "Full" for the users/groups it's scoped to.
API.perms.*identify(...)*.allowOwnership|  | Sets permissions on the given folder to "Owner" for the users/groups it's scoped to.
API.perms.*identify(...)*.getPerms|  | Resolves to a permissions object of the folder. If scoped to users/groups, only permissions relevant to them will be returned.

### Identification

Method | Argument
--- | --- | ---
API.*.path | full path to file, starting with /
API.*.folderId | folder_id of the folder

### Setting permissions for users and groups

Scoping to users and groups can be merged

```javascript
egnyte.API.perms.users(["tommy","margaret"]).groups(["All Power Users"]).path("/Shared/marketing/events").allowEdit()

```

Scoping again will override the previous setting, so the example below will only set permissions for "andy".

```javascript
egnyte.API.perms.users(["tommy","margaret"]).users(["andy"]).path("/Shared/marketing/events").allowEdit()

```

### Getting permissions for users and groups

All permissions for folder:

```javascript
egnyte.API.perms.path("/Shared/marketing/events").getPerms()

```
Returns
```
{
    "users": [{
            "subject": "admin",
            "permission": "Owner"
        }, {
            "subject": "tommy",
            "permission": "Editor"
        }, {
            "subject": "margaret",
            "permission": "Editor"
        }],
    "groups": [{
            "subject": "All Power Users",
            "permission": "Editor"
        }]
}

```

Filtered permissions information:


```javascript
egnyte.API.perms.users(["tommy"]).path("/Shared/marketing/events").getPerms()

```
Returns
```
{
    "users": [{
            "subject": "tommy",
            "permission": "Editor"
        }],
    "groups": []
}

```

## User Permissions

All API helpers return promises.

Method | Arguments | Description
--- | --- | ---
API.userPerms.*identify(...)*.get | `username` | Resolves to effective permissions for given user. `username` defaults to the user making the request.


### Identification

Method | Argument
--- | --- | ---
API.*.path | full path to folder, starting with /
API.*.folderId | folder_id of the folder

### Getting effective user permissions


```javascript
egnyte.API.userPerms.path("/Shared/Documents").get()

```
Returns
```
{
  "permission": "Full"
}

```

## Users

All API helpers return promises.

Method | Arguments | Description
--- | --- | ---
API.user.getByName | `user name` | Resolves to complete user metadata object
API.user.getById | `user id` | Resolves to complete user metadata object


## Search



Method | Arguments | Description
--- | --- | ---
API.search.getResults| `query text` | Resolves to a helper object for fetching search results
API.search.query| `query text`, `page number` | Low level search query function, resolves to a single body of the search response. Is used internally in getResults
API.search.itemsPerPage| `number` | Updates the number of items per page for search. default: 10

Results object:

Name | Description
--- |  ---
totalCount | Number of all results
totalPages | Number of available pages with results
sample  | First page of results (array of search results you'd get from calling `.page(0)`
page(`num`) | method to get a certain page of results; resolves to an array of results

Pages are numbered starting at 0.

## Events



Method | Arguments | Description
--- | --- | ---
API.events.listen| `listenerConfiguration` | Polls the Events API for new events and emits them according to configuration. Resolves to an object with a single `stop` method that stops getting more events.
API.events.getCursor| | Resolves to the latest event id
API.events.getUpdate| `updateOptions` | Makes a single request for a list of events and resolves to the response. `getUpdate` is used internally by `listen`.

listenerConfiguration:

Name | | Description
--- | --- | ---
start |  | event id - get events that happened after that id. Fails if event is too old (.listen promise gets rejected). If not set, it will get only the events that happen since the moment of invocation.
interval |  | miliseconds between making requests for events. minimum possible value is 2000, defaults to 30000
emit | required | a function to call when an event is received. the function accepts one argument - event data object.
error |  | function to call when fetching events fails
current |  | function to call with the latest event id discovered
heartbeat |  | a debug callback to be called whenever a request to events API is made.

updateOptions:

Name | | Description
--- | --- | ---
start | required | event id - get events that happened after that id. Fails if event is too old (promise gets rejected).
emit |  | a function to call for every event in the batch. the function accepts one argument - event data object. Optional, you can decide to use the raw output
count |  | number of events to fetch. Maximum value is 100

### Filtering

Method | Arguments | Description
--- | --- | ---
API.events.notMy| `"user"`(optional) | Sets up filtering to ignore events caused by the same app that is querying events. If `"user"` is passed as first argument, only events caused by current user of the app are ignored. Returns `API.events`, so it's chainable
API.events.filter| `filterDefinition` | Sets up filtering to only return events matching the definition. Can filter by folder path or event type or both. Returns `API.events`, so it's chainable

filterDefinition:

```javascript
{
    folder: "/folder/path",
    type: "file_system" or "note"
}
```

**Example:**

```javascript
egnyte.API.events.notMy().filter({
    folder: "/Shared/marketing/events"
}).listen({
    emit: function(eventData){
        //process event
    },
    interval: 10000,
    heartbeat: function(){
        console.log(".");
    }
}).then(function(polling){
    //call polling.stop() to turn the listener off
})

```

## Error handling

All errors are returned in common format of a JavaScript error enhanced with additional fields

Name |  Description
--- |  ---
statusCode | HTTP status code if error comes from the server. 0 if request failed before being sent. `undefined` if error occured in the source of this SDK
message | readable error message text
response | If the query happened, error.response is the xhr response object
body | If the query happened, error.body contains the body of the response

The "Developer over QPS" error is not returned at all, instead a call is repeated when appropriate.

## Impersonation

Egnyte Public API accepts a `X-Egnyte-Act-As` header that can be set to perform an action on behalf of another user (if you are an admin).
Every method call to `egnyte.API.*` can be preceded by impersonation like so:

```javascript
egnyte.API.link.impersonate({username:"username"}).createLink(...
egnyte.API.link.impersonate({email:"username@example.com"}).createLink(...
```

You can store an impersonated facade to use multiple times or pass it along to other components that don't need to have access to username, but need to perform on behalf of that user.

```javascript
var impersonatedStorage = egnyte.API.storage.impersonate({username:"username"});

impersonatedStorage.path("/path...").exists();
```

## Providing your own http request implementation

You can provide a request function as the `httpRequest` option.

It has to accept an `options` object and a result callback `function(error, responseObject, responseBody)`

It should be compatible with npm module called *xhr*.
