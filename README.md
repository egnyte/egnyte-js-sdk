Egnyte Widget
=============

## Usage

1. Initialize an instance. `init` method requires a URL to your Egnyte domain

        var widgetInstance = EgnyteWidget.init("http://mydomain.egnyte.com");
        
 
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