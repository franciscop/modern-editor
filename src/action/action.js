// Register a new full action
Editor.prototype.add = function(name, options){

  var editor = this;

  // Default options (empty functions)
  var fn = function(){};
  options.name = name;
  options.init = options.init || fn;
  options.action = options.action || fn;
  options.destroy = options.destroy || fn;
  options.listen = options.listen || false;

  var editor = this;
  if (options.name === 'type') {
    var realaction = function(e){

      if (e.type === 'change') {
        options.action.call(editor, editor, e.target.value, e);
      } else if (e.type === 'keydown') {
        var element = editor.menu.elements[options.name];
        element.selectedIndex++;
        if (!element.value) {
          element.selectedIndex = 0;
        }
        options.action.call(editor, editor, element.value, e);
      }
    }
  } else {
    var realaction = options.action;
  }

  // Call the init action inmediately
  options.init.call(this, this);

  // Add the action to the action event list like action:save
  this.on('action:' + name, realaction.bind(this));

  this.on('destroy', options.destroy.bind(this, this));


  // Add the shortcut only if there is one
  this.trigger('shortcut:add', { shortcut: options.shortcut, action: name });

  // Add the menu item only if there's one
  if (options.menu) {
    this.trigger('menu:add', options.menu, options);
  }

  if (options.listen) {
    this.on(options.listen, realaction);
  }
};
