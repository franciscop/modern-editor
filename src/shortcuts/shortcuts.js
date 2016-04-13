// SHORTCUTS
Editor.prototype.shortcuts = function(){
  var editor = this;

  // Make it local and overwrite defaults
  var mousetrap = new Mousetrap();
  mousetrap.stopCallback = function(){ return false; };

  this.on('shortcut:add', function(e, data){
    if (!data) return false;
    mousetrap.bind(data.shortcut, function(e){
      e.preventDefault();
      editor.trigger('shortcut', data.action);
    });
  });

  this.on("shortcut", function(e){
    editor.trigger('action:' + e.detail);
  });

  u(this.element).on("key", function(e){
    editor.trigger('refresh');
  });
};
