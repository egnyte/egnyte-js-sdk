Egnyte Widget
=============

## Usage

1. Initialize an instance. `init` method requires a URL to your Egnyte domain

        var widgetInstance = EgnyteWidget.init("http://mydomain.egnyte.com");
        
    Or if you want to use API:

        var widgetInstance = EgnyteWidget.init("http://mydomain.egnyte.com", {
                key: YOURAPIKEY,
                mobile: true      //optional
            });

2. Use features

  - File picker
  
    Open file picker:
  
        //find a DOM node to put the picker iframe in:
        var containerNode = document.getElementById("myPickerContainer");
        //open file picker
        var picker = widgetInstance.filePicker(containerNode,function(fileData){
                //handle file data
            },function(){
                //handle cancel action
            });
            
    File picker will fill the container node (width and height 100%). Minimal dimensions of the container node are 400x400 px
    
    Close file picker 
        
        picker.close();
        
   
  - Public API
  
    TBD.
   
## Tests

To run tests for the API you need to have access to the Public API first.
Create a file `spec/conf/apiaccess.js` with the following ocntent:

    egnyteDomain = "https://YOURDOMAIN.egnyte.com";
    APIToken = "YOURACCESSTOKEN";

`YOURACCESSTOKEN` is not the API key. You need to obtain the access token using your key as described in authentication section of Egnyte Public API docs.

Or you can run `grunt serve` and open `https://127.0.0.1:9999/examples/request_token.html` and go through the example.