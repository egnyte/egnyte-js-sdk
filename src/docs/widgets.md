# Widgets

|Sections|
| --- |
|[File picker](#file-picker-on-file-system-api)|
|[prompt](#prompt-widget)|

## File picker on File System API

### Initialize Egnyte SDK to use API
```javascript
var egnyte = Egnyte.init("http://mydomain.egnyte.com", {
        ...
    });
```
(See API docs)

### Open file picker:
```javascript
    //find a DOM node to put the picker in:
    var containerNode = document.getElementById("myPickerContainer");
    //open file picker
    var picker = egnyte.filePicker(containerNode,options);
```

None of the options are required. (although without the selection callback it doesn't make much sense to use the picker)

The options are:
 - `path` _String_ - a path to open the filepicker at, default: "/"
 - `cancel` _Function_ - a callback to run when the user decides to cancel selecting
 - `selection` _Function_ - a callback to run when the user makes a selection. First argument is an array of selected items.
 - `error` _Function_ - a callback to call when an error occurs. First argument is an error object. Filepicker has its default error handling, return false from your error handler function to supress that, return a string to replace the default error text. When picker instance is not useful after an error, remember to close it.
 - `barAlign` _String_ - decide if buttons on the bottom bar should be aligned to left or right, default: "right"
 - `select` _Map_ of selectables configuration
 ```javascript
 select: {
   folder: true, //should folders be selectable
   file: true,   //should files be selectable (files are hidden when not selectable)
   filesRemainVisible: false,   //should files be visible even if not selectable
   multiple: true,   //should allow multiselection
   forbidden: []  //array of folder paths that selection is forbidden in
 }
 ```
 - `texts` _Map_ of labels in the filepicker to replace with given replacements, optional
 ```javascript
 texts: {
   "Ok": "...",
   "Cancel": "...",
   "Loading": "...",
   "This folder is empty": "..."
 }
 ```

 - `keys` _Map_ to override default keybinding, set to false to disable all keyboard handling

 ```javascript
 keys: {
    "up": "<up>",
    "down": "<down>",
    "select": "<space>",
    "explore": "<right>",
    "back": "<left>",
    "confirm": "none",
    "close": "<escape>"
 }
 ```
All keys handled by https://github.com/chrisdickinson/vkey are available.

 - `filterExtensions` _Function_ - a filter function that decides if file should be visible to the user. Google drive files are filtered out by default. Pass `false` explicitly to disable filtering.  First argument to the function is 3 first characters of file extension, second is the internal mime group name (used for icon colors too).

 ```javascript
 filterExtensions: function(ext3chars, mime){
    return ext3chars==="htm"; //show only htm* files
 }
 ```
 Possible values of mime: `"audio", "video", "pdf", "word_processing", "spreadsheet", "presentation", "cad", "text", "image", "archive", "goog"`

 - `noFont` _Boolean_ - set to true to opt-out from linking Open Sans from google fonts. The font will be linked to only once if at least one filepicker instance doesn't have `noFont:true` in options.

----

_Examples_

Open on `/Private` location, with single selection and changed labels for OK and empty folder

```javascript
var picker = egnyte.filePicker(containerNode,{
    path: "/Private",
    navigation: function(currentFolder){
        //handle change folder
        },
    selection: function(list){
        //handle selection
        },
    cancel: function(){
        //the user cancelled. containerNode will be emptied by the filepicker itself.
        },
    select: {
        multiple: false //single selection
        },
    texts: {
        "Ok": "Continue",
        "This folder is empty": "Nothing here, sorry"
        }
    });
```

Added a detailed error handler for
```javascript
var picker = egnyte.filePicker(containerNode,{
    selection: function(list){
        //handle selection
        },
    cancel: function(){
        //the user cancelled. containerNode will be emptied by the filepicker itself.
        },
    error: function(e){
        if(e.statusCode == 503){
            return "Server is tired of all this querying"
            }
        }
    });
```

File picker will fill the container node (width and height 100%). Minimal dimensions of the container node are 400x400 px

The `currentFolder` returned to the navigaion callback is an object matching the following signature:

```javascript
{
    folder_id: "f78ee5e7-afbd-4b18-89db-4526e32ae271",
    path: "/Private/jsmith",
    forbidSelection: false
}
```

The `list` returned to the selection callback is an array of objects matching the followng signatures:

_File_

```javascript
{
    checksum: "6459fa7c904...6e9b84318b",
    entry_id: "f78ee5e7-afbd-4b18-89db-4526e32ae271",
    is_folder: false,
    last_modified: "Tue, 20 May 2014 09:35:15 GMT",
    name: "foo.png",
    path: "/Private/jsmith/foo.png",
    size: 1818,
    uploaded_by: "jsmith"
}
```

_Folder_

```javascript
{
    folder_id: "e76e6737-99cd-4ba9-bece-25e4d366241b",
    is_folder: true,
    name: "foo",
    path: "/Private/jsmith/foo"
}
```

### Close file picker

File picker can be closed without the user clicking "cancel":
```javascript
    picker.close();
```

### Get current folder

```javascript
    picker.getCurrentFolder();
```

### Change the style

File picker is easily stylable on its own. To ease the work of theming start with the `examples/theme.css` file and modify available properties. To see how the theme affects the filepicker see `examples/filepicker_theme.html`

You can also modify the defaults to keep everything in one package. Change the colors in variables of `src/lib/filepicker_elements.view.less` and rebuild the package `grunt dist` (requires grunt and other dependencies installed via `npm`)

## Prompt widget


### Open prompt:
```javascript
    //find a DOM node to work with:
    var containerNode = document.getElementById("myPickerContainer");
    //open prompt
    var promptObj = egnyte.prompt(containerNode,{
        texts:{
            question: "What's your name"
        },
        result:function(name){
        //do stuff
        }
    });
```


The options are:
 - `result` _Function_ - a callback to run when the user clicks ok. First argument is the string from user input
 - `barAlign` _String_ - decide if buttons on the bottom bar should be aligned to left or right, default: "right"
 - `texts` _Map_ of labels in the widget to replace with given replacements. Put your question in the `question` field


### Close the prompt

Prompt can be closed without the user clicking the button:
```javascript
    promptObj.close();
```
