# File picker

## Initialize Egnyte SDK to use API
```javascript
var egnyte = Egnyte.init("http://mydomain.egnyte.com", {
        ...
    });
```
See [ API docs ](api.html)

## Open file picker:
```javascript
    //find a DOM node to put the picker iframe in:
    var containerNode = document.getElementById("myPickerContainer");
    //open file picker
    var picker = egnyte.filePicker(containerNode,options);
```
The options are:
 - `path` String - a path to open the filepicker at, default: "/"
 - `cancel` Function - a callback to run when the user decides to cancel selecting
 - `selection` Function - a callback to run when the user makes a selection. First argument is an array of selected items.
 - `select` Map of selectables configuration
 - `barAlign` String - decide if buttons on the bottom bar should be aligned to left or right, default: "right"
 
```javascript
select: {
  folder: true, //should folders be selectable
  file: true,   //should files be selectable (files are hidden when not selectable)
  multiple: true   //should allow multiselection
}
```

_Example_

```javascript
var picker = egnyte.filePicker(containerNode,{
    path: "/Private",
    selection: function(list){
        //handle selection
        },
    cancel: function(){
        //the user cancelled. containerNode will be emptied by the filepicker itself.
        },
    select: {
        multiple: false //single selection
        }
    });
```

File picker will fill the container node (width and height 100%). Minimal dimensions of the container node are 400x400 px

## Close file picker 

File picker can be closed without the user clicking "cancel":
```javascript
    picker.close();
```

# File picker remote

If API with oAuth flow is not a desired way to use Egnyte, you can use a filepicker version that will present the user with a view from Egnyte online file storage behind an ordinary log-in instead of the API.

To use the remote file picker call `filePickerRemote` instead of `filePicker` with the same options
```javascript
    //simplified init
    var egnyte = Egnyte.init("http://mydomain.egnyte.com");
    
    var picker = egnyte.filePicker(containerNode,options);
```
The `select` option is not available in remote file picker.