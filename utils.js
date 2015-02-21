'use strict';

  function Utils(context){
    if(context){
      this.context = context;
    }
    return this
  }
  Utils.copyFiles = function (){
    for(var i=0; i < arguments.length; i++){
      if(typeof arguments[i] == "object" && arguments[i].hasOwnProperty('src')){
        var destination = arguments[i].dest || arguments[i].src;
        this.fs.copy(
          this.templatePath(arguments[i].src),
          this.destinationPath(destination)
        );
      } else if(typeof arguments[i] == "string") {
        this.fs.copy(
          this.templatePath(arguments[i]),
          this.destinationPath(arguments[i])
        );
      } else{
        throw "Copy file requires an object with a path parameter";
      }
    }
  }

module.exports = new Utils()
