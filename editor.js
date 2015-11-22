// Editor
var Editor = function(selector, options){
  
  // Store a local instance
  var editor = this;
  
  // The instance's editor element (it is required)
  this.element = this.s(selector);
  if (!this.element) return false;
  
  this.options = defaults(options, {
    
    // Class that will be added to the menu
    menu: 'menu',
    
    // Delay for each of the text selections checks (there's no event onselect)
    delay: 200,
    
    // Transition for the menu from removing the class 'visible' to removing the html
    transition: 200
  });
  
  
  
  
  // EVENTS
  this.events = {};
  
  // Add one of the events
  this.on = function(name, callback){
    if (!editor.events[name]) editor.events[name] = [];
    editor.events[name].push(callback);
  };
  
  // Trigger one of the events
  this.trigger = function(name, event){
    if (editor.events[name]) {
      editor.trigger(name + ':before', event);
      
      editor.events[name].forEach(function(callback){
        editor.trigger(name + ':pre', event);
        callback.call(editor, event);
        editor.trigger(name + ':post', event);
      });
      
      editor.trigger(name + ':after', event);
    }
    else if (editor.events[name + ':none']) {
      editor.trigger(name + ':none', event);
    }
    
  };
  
  
  
  
  
  
  
  // ACTIONS
  this.action = {};
  
  // Register a new action
  this.action.add = function(name, options){
    
    // Default options
    var fn = function(){};
    options = defaults(options, { init: fn, action: fn, destroy: fn });
    
    // Add the action to the action list so it can be referenced
    editor.on('action:' + name, options.action.bind(editor));
    
    // Add the shortcut only if there is one
    var short = options.shortcut;
    if (short) {
      short = defaults(short, {
        key: short.toLowerCase(),
        code: short.toUpperCase().charCodeAt(),
        action: name,
        ctrl: true
      });
      
      short.toString = function(){
        return '[' + (short.ctrl ? 'ctrl+' : '') + short.key + ']';
      };
      
      editor.shortcuts.add(short);
    }
    
    // Add the menu item only if there's one
    if (options.menu) {
      
      // Default options for the menu
      options.menu = defaults(options.menu, {
        html: options.menu,
        action: name,
        title: (short ? short + ' ' : '') + name
      });
      
      editor.trigger('menu:add', options.menu);
    }
  };
  
  this.on('action', function(name){
    editor.trigger('action:' + name);
  });
  
  
  
  
  
  
  // MENU
  this.menu = {
    list: [],
    get: function(){ return editor.s('.' + editor.menu.class); },
    class: this.options.menu,
    visible: false,
    transition: false // Whether or not the menu is in transition
  };
  
  this.on('menu:create', function(){
    
    var menuhtml = '<ul class="' + editor.menu.class + '"></ul>';
    editor.s('body').insertAdjacentHTML('beforeend', menuhtml);
    var menu = editor.s('.' + editor.menu.class);
    
    editor.menu.list.forEach(function(element){
      var li = document.createElement('li');
      
      li.setAttribute('title', element.title);
      li.addEventListener("click", function(e) {
        e.preventDefault();
        editor.trigger('action', element.action);
      });
      li.innerHTML = element.html;
      menu.appendChild(li);
    });
  });
  
  this.on("menu:add", function(item){
    this.menu.list.push(item);
  });
  
  this.on('menu:show', function(){
    
    // Retrieve the menu
    var menu = editor.menu.get();
    
    if (!menu) {
      editor.trigger('menu:create');
    }
    
    menu = editor.menu.get();
    
    // Position it correctly
    menu.style.display = 'block';
    
    editor.selection.position();
    
    menu.style.left = editor.menu.position.left;
    menu.style.top = editor.menu.position.top;
    
      
    if (editor.menu.transition) return false;
    
    menu.classList.add("visible");
    
    editor.menu.transition = true;
    setTimeout(function(){
      editor.menu.transition = false;
    }, editor.options.transition);
  });
    
  // Hide the menu with a 100ms transition
  this.on('menu:hide', function(){
    
    if (editor.menu.transition) return false;
    
    // Hide only when needed
    var menu = editor.menu.get();
    if (!menu) {
      return false;
    }
    
    menu.classList.remove("visible");
    editor.menu.transition = true;
    setTimeout(function(){
      menu.style.display = "none";
      editor.menu.transition = false;
    }, editor.options.transition);
  });
  
  
  
  
  
  
  this.isActive = false;
  this.active = function(on){
    
    // Match true, false or empty (which is true)
    editor.isActive = on !== false;
    
    if (editor.isActive) {
      editor.element.setAttribute("contenteditable", true);
      editor.element.focus();
    } else {
      editor.element.setAttribute("contenteditable", false);
      editor.element.blur();
    }
  };
  
  
  this.command = function(command, text){
    return document.execCommand(command, false, text);
  };
  
  
  
  
  
  
  // SELECTION
  this.selection = { element: false, text: "" };
  
  this.selection.position = function(){
    var doc = editor.s("html").getBoundingClientRect();
    var selection = editor.selection.range.getBoundingClientRect();
    var menuEl = editor.menu.get();
    if (!menuEl) return false;
    var menu = menuEl.getBoundingClientRect();
    
    // Delete the '60' to show it on the bottom
    var top = selection.top - menu.height - 12 - doc.top;
    if (top < 0 ) top = 0;
    var left = selection.left + selection.width / 2 - menu.width / 2;
    editor.menu.position = {
        top: top + "px",
        left: left + "px"
    };
  };
  
  // Format nicely the code (if needed)
  this.on('refresh', function(){
      
    var html = editor.element.innerHTML;
    if (!html || html.match(/^\s+$/) || html.match(/^<br\/?>$/)) {
      editor.command("insertParagraph");
      var br = editor.element.querySelector("br");
      if (br && br.parentNode) {
        br.parentNode.removeChild(br);
      }
    }
  });
  
  // Display/hide the menu
  this.on('refresh', function(){
    
    if (editor.selection.check()) {
      editor.trigger('select', editor.selection);
    }
    else {
      editor.trigger('menu:hide');
    }
  });
  
  this.on('select', function(selection){
    this.trigger('menu:show');
  });
  
  this.selection.check = function(){
    
    // The selection from the current window
    var selection = window.getSelection();
    
    editor.selection.range = selection.getRangeAt(0);
    
    // Store the *right* element
    var node = selection.anchorNode;
    if (!node) return false;
    editor.selection.element = node.nodeType == 1 ? node : node.parentElement;
    
    // Selected text
    editor.selection.text = selection.toString();
    
    // If there's no selection hide the menu and leave
    return (editor.selection.text && editor.element.contains(editor.selection.element));
  };
  
  window.setInterval(editor.trigger.bind(this, 'refresh'), this.options.delay);
  
  // document.addEventListener("keydown", function(e){
  //   if (!e.ctrlKey && !e.metaKey) {
  //     return true;
  //   }
  //   if (editor.shortcuts[e.keyCode]) {
  //     e.preventDefault();
  //     editor.shortcuts[e.keyCode](editor.selection.text, editor);
  //   }
  // });
  
  
  
  
  
  document.addEventListener("keydown", function(e){ editor.trigger('key', e); });
  document.addEventListener("mousedown", function(e){ editor.trigger('click', e); });
  document.addEventListener("touchstart", function(e){ editor.trigger('click', e); });
  document.addEventListener("click", function(e){ editor.trigger('click', e); });
  
  
  
  this.on("key", function(e){
    
    var action = this.shortcuts.get(e);
    
    if (action) {
      this.trigger('action', action);
    }
  });
  
  this.on("key", function(e){
    this.trigger('refresh', e);
  });
  
  // On mousedown check whether or not we click on the menu
  this.on("click", function (e) {
    
    // The current menu
    var menu = this.menu.get();
      
    // Don't unselect text when clicking on the menu
    if (menu && menu.contains(e.target)) {
      e.preventDefault();
    }
  });
  
  this.on("click", function(e){
    this.trigger('refresh', e);
  });
  
  
  
  
  
  // SHORTCUTS
  this.shortcuts = { list: [] };
  this.shortcuts.add = function(shortcut){
    editor.shortcuts.list.push(shortcut);
  };
  
  this.shortcuts.get = function(e){
    
    e.preventDefault();
    
    editor.shortcuts[e.keyCode](editor.selection.text, editor);
    
    for (var name in editor.shortcuts.list) {
      var short = editor.shortcuts.list[short];
      
      for (var key in short) {
        var value = short[key];
        
        switch(key){
          case 'control':
            var pressed = e.ctrlKey || e.metaKey;
            if (pressed !== value) return false;
            break;
          case 'key':
            if (e.keyCode != value) return false;
            break;
        }
      }
    }
    
    return name;
  };
};










// Select elements in a similar fashion to jQuery without requiring it
Editor.prototype.s = function(selector, context){
  context = context || document;
  return (selector.nodeType) ? selector : context.querySelector(selector);
};


// Based on https://github.com/tmpvar/defaults/blob/master/index.js
function defaults(options, def, wrap) {
  options = typeof options === 'object' ? options : {};
  
  Object.keys(def).forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      options[key] = def[key];
    }
  });

  return options;
}
