
// SHORTCUTS
Editor.prototype.shortcuts = function(){
  var editor = this;

  // Make it local and overwrite defaults
  var mousetrap = new Mousetrap();
  mousetrap.stopCallback = function(){ return false; };

  this.on('shortcut:add', function(data){
    if (!data || !data.shortcut) return false;
    mousetrap.bind(data.shortcut, function(e){
      e.preventDefault();
      editor.trigger('shortcut', data.action, e);
    });
  });

  this.on("shortcut", function(data, e){
    editor.trigger('action:' + data, e);
  });

  u(this.element).on("keyup", function(e){
    editor.history.register();
    editor.trigger('refresh');
  });
};
