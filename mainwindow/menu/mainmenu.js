var remote = require('remote');
var Menu = remote.require('menu');
var ipc = require('electron').ipcRenderer;

var template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'About Developer',
        click: function(){ alert('This application was created by Charlie A.  You can send an email to charliedevelopmentaccess@gmail.com to contact the creator.  You can also view the creators GitHub at https://www.github.com/charliegitdb\n\nApplication Icon Created By: http://creativecommons.org/') }
      },
      {
        label: 'View Programs Source Code',
        click: function(){ ipc.send('toggle-github'); }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: function(){window.close();}
      },
    ]
  }
];

menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
