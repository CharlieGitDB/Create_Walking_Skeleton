//REQUIRED MODULES
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;
var fs = require('fs');

// process.platform

//WHEN APPLICATION IS READY
app.on('ready', function(){

  //CREATE THE MAIN WINDOW FOR USERS TO INTIALLY SEE
  var mainWindow = new BrowserWindow({
    width: 480,
    height: 200,
    center: true,
    maximizable: false
  });
  mainWindow.setResizable(false);
  mainWindow.setMenu(null);
  mainWindow.loadURL('file://' + __dirname + '/mainwindow/index.html');
  mainWindow.on('close', function(e){
    app.quit();
  });

  //CREATE HIDE AND SHOWABLE GIT WINDOW
  gitWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  });
  gitWindow.setMenu(null);
  gitWindow.loadURL('https://github.com/charliegitdb');
  gitWindow.on('close', function(e){
    e.preventDefault();
    hideShowGitWin();
  });

  ipc.on('toggle-github', function(){
    hideShowGitWin();
  });

  function hideShowGitWin(){
    if(gitWindow.isVisible()){
      gitWindow.hide();
    }else{
      gitWindow.show();
    }
  }

  ipc.on('create-skeleton', function(e, skelPath){
    if(fs.existsSync(skelPath)){
      e.sender.send('folder-exists');
    }else{
      try{
        //MAKE THE DIRECTORIES
        fs.mkdirSync(skelPath);
        fs.mkdirSync(skelPath + '/scripts');
        fs.mkdirSync(skelPath + '/server');
        fs.mkdirSync(skelPath + '/server/public');
        fs.mkdirSync(skelPath + '/server/routes');
        fs.mkdirSync(skelPath + '/server/public/scripts');
        fs.mkdirSync(skelPath + '/server/public/views');
        fs.mkdirSync(skelPath + '/server/public/vendors');
        fs.mkdirSync(skelPath + '/server/public/styles');

        //WRITE THE JAVASCRIPT FILES
        fs.writeFile(skelPath + '/scripts/main.js');
        fs.writeFile(skelPath + '/server/routes/index.js',
`var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

router.use('/', express.static(path.join(__dirname, '../public')));
router.get('/', function(request,response){
  response.sendFile(path.join(__dirname, '/../public/views/index.html'));
});
module.exports = router;`);
        fs.writeFile(skelPath + '/server/server.js',
`var express = require('express');
var path = require('path');
var index = require('./routes/index');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use('/', index);

var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('Listening on port: ', port);
});`);
    fs.writeFile(skelPath + '/server/public/views/index.html',
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="scripts/main.min.js"></script>
</head>
<body>

</body>
</html>`);
    fs.writeFile(skelPath + '/Gruntfile.js',
`module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'scripts/main.js',
                dest: 'server/public/scripts/main.min.js'
            }
        },
        watch: {
    			scripts: {
    				files: ['scripts/main.js'],
    				tasks: ['uglify'],
    				options: {
    					spawn: false
    				}
    			}
    		}
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify', 'watch']);

};`);
    fs.writeFile(skelPath + '/.gitignore',
`node_modules
readme`);
    fs.writeFile(skelPath + '/package.json',
`{
  "name": "yourprojectnamehere",
  "version": "1.0.0",
  "description": "",
  "main": "server/server.js",
  "scripts": {
    "test": "echo 'error no test found' exit 1",
    "start": "nodemon server/server.js"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "~4.13.3",
    "grunt": "~0.4.5",
    "grunt-contrib-watch": "~0.8.2",
    "grunt-contrib-uglify": "~0.11.0",
    "grunt-contrib-watch": "~0.6.1",
    "path": "~0.12.7",
    "body-parser": "~1.14.2"
  }
}`);

    fs.writeFile(skelPath + '/readme',
`Things you will need to do for your project to be fully finished:

1.) You will need to change the information inside of your package.json, change the version number, description, and name.  These are all option of course but are recommended.
2.) You will need to open up a terminal and npm init, and npm install.
3.) You will need to open a second terminal and grunt.
4.) You will need to decide a client frame work if needed (ie angular, jquery)
5.) If there is any odd issues try running npm update.
6.) You will need grunt and nodemon installed globally.
`);

        e.sender.send('success');
      }catch(err){
        e.sender.send('error');
      }
    }
  });
});

//WHEN ALL WINDOWS ARE CLOSED QUIT THE APPLICATION
app.on('window-all-closed', function(){
  if(process.platform != 'darwin'){
    app.quit();
  }
});

// fs.mkdirSync('C:/Users/C/Desktop/Windows Projects/skellycreator/bobjim');

// var exec = require('child_process').exec;
// var child;
// child = exec("start cmd.exe", function (error, stdout, stderr) {
//   console.log('stdout: ' + stdout);
//   console.log('stderr: ' + stderr);
//   if (error !== null) {
//     console.log('exec error: ' + error);
//   }
//
//
// });
// var blah = exec('cd C:/Users/C/Documents', function (error, stdout, stderr) {
//   console.log('stdout: ' + stdout);
//   console.log('stderr: ' + stderr);
//   if (error !== null) {
//     console.log('exec error: ' + error);
//   }
// });
