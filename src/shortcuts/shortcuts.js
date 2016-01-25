
// SHORTCUTS
Editor.prototype.shortcuts = function(){
  
  var editor = this;
  this.shortcuts.list = [];

  this.on('shortcut:add', function(short){
    
    if (!short.shortcut) return false;
    
    short.keys = short.shortcut.split('+');
    
    //new Shortcut(short);
    editor.shortcuts.list.push(short);
  });

  this.on("key", function(e){
    
    // Store the pressed key
    e[e.key.toLowerCase()] = true;
    
    // Normalize Mac's ~weird~ key
    e.ctrl = e.ctrlKey || e.metaKey;
    e.shift = e.shiftKey;
    e.alt = e.altKey;
    e.esc = e.keyCode == 27;
    
    function keyCode(short){
      return !short.keys.filter(function(key){ return !e[key]; }).length;
    }
    
    var shortcut = editor.shortcuts.list.filter(keyCode);
    shortcut.forEach(function(short){
      if (!shortcut.default) {
        e.preventDefault();
      }
      this.trigger('shortcut', short);
    }, this);
  });

  this.on("shortcut", function(short){
    this.trigger('action');
    this.trigger('action:' + short.action);
  });

  this.on("key", function(e){
    this.trigger('refresh', e);
  });
};
