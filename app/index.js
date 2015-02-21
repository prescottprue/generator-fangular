'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var path = require('path');
module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', { type: String, required: false });
    this.appname = this.name || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
    this.appPath = this.env.options.appPath;
    this.pkg = require('../package.json');
    this.version = this.pkg.version || "0.0.0";

    // this.copyFile = function(args){
    //   return copyFile().apply(this, args);
    // }
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Fangular') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What would you like to name this project?',
      default: "fanularApp"
    },
    // {
    //   type: 'confirm',
    //   name: 'inFolder',
    //   message: 'Are you already in a directory matching this name?',
    //   default: true
    // },
    {
      type: 'confirm',
      name: 'includeMaterial',
      message: 'would you like to include Google Material Design Library?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeIonic',
      message: 'would you like to include ionic?',
      default: true
    }];
    this.prompt(prompts, function (props) {
      this.answers = {};
      for(var i = 0; i < props.length; i++ ){
        this.answers[i.name] = props[i.name];
      }
      // this.includeIonic = props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      //Angular is Included
      this.mkdir('app/components');
      var context = {
        appName: this.appname,
        version: this.version
      }
      this.template("_package.json", "package.json", context);
      this.template("_bower.json", "bower.json", context);
      this.template("_app-config.js", "app/app-config.js", context);

      var filesToCopy = [
      {src:'app-controllers.js', dest:'app/app-controllers.js'}, 
      {src:'app.js', dest:'app/app.js'},
      {src:'index.html', dest:'app/index.html'},
      ];
      function copyFiles (){
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
      copyFiles.apply(this, filesToCopy);

      // if(this.answers.includeIonic){
      //   this.fs.copy(
      //     this.templatePath('app-config.js'),
      //     this.destinationPath('app-config.js')
      //   );
      // }

      // if(this.answers.inFolder){

      // } else {
      //   //Handle creating new folder
      //   this.mkdir(this.appname);
      //   this.fs.copy(
      //     this.templatePath('app-config.js'),
      //     this.destinationPath('app-config.js')
      //   );
      // }

      // this.copyFile()

      // this.fs.copy(
      //   this.templatePath('_package.json'),
      //   this.destinationPath('package.json')
      // );
      // this.fs.copy(
      //   this.templatePath('_bower.json'),
      //   this.destinationPath('bower.json')
      // );
    },

    projectfiles: function () {

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
