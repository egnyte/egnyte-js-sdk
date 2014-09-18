#Usage notes for node.js

The authorization flow has to be done in the browser, so you'll need to get the access token from there and initialize Egnyte with the token. 

All API methods work as described in main docs, with the following exceptions:

`API.storage.storeFile` accepts a data stream instead of a blob. It also takes two optional arguments which are MIME type and size (in bytes) of stream.

```javascript
var fileStream = fs.createReadStream('sample.txt')
egnyte.API.storage.storeFile(pathFromRoot, fileStream, "text/plain", 1105)
    .then(function(filemeta){
        //
    })

```

`API.storage.getFileStream` a new method for node to get a stream instead of a promise. Use it instead of `API.storage.download`

```javascript
egnyte.API.storage.getFileStream(pathFromRoot).pipe(whereverYouWant)

```

The streams are handled by the `request` npm module. 