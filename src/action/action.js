// Register a new full action
Editor.prototype.add = function(name, options){
  
  // Default options (empty functions)
  var fn = function(){};
  options = this.defaults(options, { init: fn, action: fn, destroy: fn });
  
  // Call the init action inmediately
  options.init.call(editor);
  
  // Add the action to the action event list like action:save
  this.on('action:' + name, options.action.bind(this, this));
  
  this.on('destroy', options.destroy.bind(this, this));
  
  
  // Add the shortcut only if there is one
  this.trigger('shortcut:add', { shortcut: options.shortcut, action: name });
  
  // Add the menu item only if there's one
  if (options.menu) {
    
    // Default options for the menu
    options.menu = this.defaults(options.menu, {
      html: options.menu,
      title: (options.shortcut ? '[' + options.shortcut + '] ' : '') + name,
      action: name
    });
    
    this.trigger('menu:add', options.menu);
  }
};

