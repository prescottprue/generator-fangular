'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('underscore');


var path = require('path');
var libraryOptions = [
  {"name":'Angular-Material' , "value": "material", "checked": true}, 
  {"name":'Ionic' , "value": "ionic"}, 
  {"name":'Fireadmin' , "value": "fireadmin", "checked": true}
];
var authProviders = [
    { "name": "Email/Password", "value": "password", "checked": true },
    { "name": "Anonymous",      "value": "anonymous" },
    { "name": "Facebook",       "value": "facebook"  },
    { "name": "Google",         "value": "google"    },
    { "name": "Twitter",        "value": "twitter"   },
    { "name": "GitHub",         "value": "github"    }
  ];
module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', { type: String, required: false });
    this.appname = this.name || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
    this.appPath = this.env.options.appPath;
    this.pkg = require('../package.json');
    this.version = this.pkg.version || "0.0.0";
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Fangular') + ' generator!'
    ));
    this.log('has color:', chalk.hasColor('blue'));
    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What would you like to name this project?',
      default: "fanularApp"
    },
    {
      name: 'firebaseName',
      message: 'Firebase instance (https://' + chalk.red('<your instance>') + '.firebaseio.com)',
      required: true,
      validate: function (input) {
        if( !input ) { return false; }
        if( input.match('http') || input.match('firebaseio.com') ) {
          return chalk.red('Just include the Firebase name, not the entire URL');
        }
        if (!input.match(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/)) {
          return chalk.red('Your Firebase name may only contain [a-z], [0-9], and hyphen (-). ' +
            'It may not start or end with a hyphen.');
        }
        return true;
      }
    },
    {
      type: "checkbox",
      name: "includeLibraries",
      default: 1,
      message: "What Front end libraries would you like to use?",
      choices: libraryOptions,
      validate: function(picks) {
        return picks.length > 0? true : 'Really? These are some nice libraries...';
      },
    },
    {
      type: 'confirm',
      name: 'includeUser',
      message: 'Would you like include to user login/signup/session management using Fireadmin?',
      default: true
    },
    {
      type: 'checkbox',
      name: 'providers',
      message: 'Which providers shall I install?',
      choices: authProviders,
      when: function(answers) {
        return answers.includeUser;
      },
      validate: function(picks) {
        return picks.length > 0? true : 'Must pick at least one provider';
      },
      default: ['password']
    },

        // {
    //   type: 'confirm',
    //   name: 'inFolder',
    //   message: 'Are you already in a directory matching this name?',
    //   default: true
    // },
    ];
    this.prompt(prompts, function (props) {
      this.answers = {}
      _.extend(this.answers, props);
      // this.includeIonic = props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      //Main app files
      var devFolder = 'dev';
      var distFolder = 'dist';

      this.mkdir(devFolder);
      this.mkdir(distFolder);

      this.mkdir('dist');


       var filesToCopy = [
        {src:'_navbar.html', dest: devFolder+'/templates/navbar.html'}, 
        {src:'_app.js', dest:devFolder+'/app.js'},
        {src:'_index.html', dest:devFolder+'/index.html'}
        {src:'_app-config.js', dest:devFolder+'/app-config.js'}

      ];
      //Angular is Included
      if(this.answers.includeUser){
        this.mkdir(devFolder+'/components');
        // [TODO] Include session component
        // filesToCopy.push([{src:, dest:devFolder+'/components/session'}])
      }

      this.templateContext = {
        appName: this.appname,
        version: this.version
      }

      function copyFiles (){
        for(var i=0; i < arguments.length; i++){
          if(_.isObject(arguments[i]) && _.has(arguments[i],'src')){
            var destination = arguments[i].dest || arguments[i].src;
            if(arguments[i].charAt(0) === "_"){
              this.template(arguments[i], destination, this.templateContext);
            } else {
              this.fs.copy(
                this.templatePath(arguments[i].src),
                this.destinationPath(destination)
              );
            }
          } else if(_.isString(arguments[i])) {
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

    },

    projectfiles: function () {
      // this.template("_package.json", "package.json", context);
      // this.template("_bower.json", "bower.json", context);
      // this.template("_Gruntfile.js", "Gruntfile.js", context);

      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('.bower.json')
      );
      this.fs.copy(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );
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
