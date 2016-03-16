var ipc = require('electron').ipcRenderer;

$(function(){
  $('.skelePath').focus();

  $(document).keypress(function(e){
    if(e.which == 13){
      sendSkel();
    }
  });

  $('body').on('click', '.createSkel', function(){
    sendSkel();
  });
});

function sendSkel(){
  var skelerPath = $('.skelePath').val();
  ipc.send('create-skeleton', skelerPath);
  $('.skelePath').val('');
}

function setText(color, msg){
  $('.mainMsg').css('color', color);
  $('.mainMsg').text(msg);
  setTimeout(function(){
    $('.mainMsg').text('');
  }, 4000);
}

ipc.on('folder-exists', function(){
  setText('red', 'That folder already exists! Try another folder.');
});

ipc.on('error', function(){
  setText('red', 'An unidentifiable error has occured.  It is most likely that you have a misspelling in your creation path.');
});

ipc.on('success', function(){
  setText('green', 'Node.js walking skeleton created!');
});
