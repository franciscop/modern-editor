// Editor
var Editor = function(selector, options){
  
  
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
  
  // Store a local instance
  var editor = this;
  
  // The instance's editor element (it is required)
  this.element = this.s(selector);
  if (!this.element) return false;
  
  this.options = defaults(options, {
    
    // Class that will be added to the menu
    menu: 'menu',
    
    // Delay for each of the text selections checks (there's no event onselect)
    delay: 200
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
      
      //console.log(name);
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
  // Register a new action
  this.add = function(name, options){
    
    // Default options (empty functions)
    var fn = function(){};
    options = defaults(options, { init: fn, action: fn, destroy: fn });
    
    // Add the action to the action event list like action:save
    editor.on('init', options.init.bind(editor));
    
    // Add the action to the action event list like action:save
    editor.on('action:' + name, options.action.bind(editor));
    
    // Add the action to the action event list like action:save
    editor.on('destroy', options.destroy.bind(editor));
    
    
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
      
      editor.trigger('shortcut:add', short);
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
  
  
  
  
  
  
  // MENU
  this.menu = {
    list: [],
    element: false,
    visible: false,
    class: this.options.menu
  };
  
  this.on('init', function(){
    var menuhtml = '<ul class="' + editor.menu.class + '"></ul>';
    editor.s('body').insertAdjacentHTML('beforeend', menuhtml);
    this.menu.element = editor.s('.' + editor.menu.class);
  });
  
  // Add an element to the menu
  this.on("menu:add", function(element){
    
    var li = document.createElement('li');
    
    li.setAttribute('title', element.title);
    li.addEventListener("click", function(e) {
      e.preventDefault();
      editor.trigger('action:' + element.action);
    });
    li.innerHTML = element.html;
    this.menu.element.appendChild(li);
  });
  
  // Show the menu
  this.on('menu:show', function(){
    this.menu.element.style.display = 'block';
    this.menu.element.visible = true;
  });
    
  // Hide the menu
  this.on('menu:hide', function(){
    this.menu.element.style.display = "none";
    this.menu.element.visible = false;
  });
  
  // Position the menu correctly
  this.on('menu:move', function(){
    var selection = this.selection.position;
    var doc = editor.s("html").getBoundingClientRect();
    var menu = editor.menu.element.getBoundingClientRect();
    
    // Delete the '60' to show it on the bottom
    var top = selection.top - 12 - menu.height - doc.top;
    if (top < 0 ) top = 0;
    var left = selection.left + selection.width / 2 - menu.width / 2;
    if (left < 0) left = 0;
    editor.menu.position = {
        top: top + "px",
        left: left + "px"
    };
    this.menu.element.style.left = this.menu.position.left;
    this.menu.element.style.top = this.menu.position.top;
  });
  
  // On mousedown check whether or not we click on the menu
  this.on("click", function (e) {
      
    // Don't unselect text when clicking on the menu
    if (this.menu.element && this.menu.element.contains(e.target)) {
      e.preventDefault();
    }
  });
  
  this.on("click", function(e){
    this.trigger('refresh', e);
  });
  
  
  
  
  
  // SELECTION
  this.selection = { element: false, text: "" };
  
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
    
    var prev = this.selection.text;
    this.trigger('select:check');
    var post = this.selection.text;
    
    // If the selections has changed
    if (prev != post) {
      this.trigger('select');
    }
  });
  
  this.on('select', function(){
    this.selection.position = editor.selection.range.getBoundingClientRect();
  });
  
  // When the selection changes, check its value
  this.on('select', function(){
    
    var selected = this.selection.text;
    var hidden = this.menu.element.style.display !== 'block';
    
    if (selected && hidden) {
      this.trigger('menu:show');
    }
    
    if (selected) {
      this.trigger('menu:move');
    }
    
    if (!selected && !hidden) {
      this.trigger('menu:hide');
    }
  });
  
  this.on('select:check', function(){
    
    // The selection from the current window
    var selection = window.getSelection();
    
    this.selection.range = selection.getRangeAt(0);
    
    // Store the *right* element
    var node = selection.anchorNode;
    if (!node) return false;
    this.selection.element = node.nodeType == 1 ? node : node.parentElement;
    
    // Selected text
    this.selection.text = selection.toString();
    
    // If there's no selection hide the menu and leave
    return (this.selection.text && this.element.contains(this.selection.element));
  });
  
  
  
  
  // SHORTCUTS
  this.shortcuts = [];
  
  this.on('shortcut:add', function(short){
    this.shortcuts.push(short);
  });
  
  this.on("key", function(e){
    
    // Normalize Mac's weird key
    e.ctrl = e.ctrlKey || e.metaKey;
    
    function keyCode(short){
      var charMatch = e.key.length == 1 ? e.key.charCodeAt(0) == short.code : false;
      return e.keyCode == short.code || charMatch;
    }
    function ctrlKey(short){ return (short.ctrl) ? e.ctrl : true; }
    function escKey(short){ return (short.esc) ? e.esc : false; }
    
    var shortcut = editor.shortcuts.filter(keyCode).filter(ctrlKey);
    shortcut.forEach(function(short){
      e.preventDefault();
      editor.trigger('shortcut', short);
    });
  });
  
  this.on("shortcut", function(name){
    editor.trigger('action:' + name.action);
  });
  
  this.on("key", function(e){
    this.trigger('refresh', e);
  });
  
  
  
  
  
  window.setInterval(editor.trigger.bind(this, 'refresh'), this.options.delay);
  document.addEventListener("keydown", function(e){ editor.trigger('key', e); });
  document.addEventListener("mousedown", function(e){ editor.trigger('click', e); });
  document.addEventListener("touchstart", function(e){ editor.trigger('click', e); });
  document.addEventListener("click", function(e){ editor.trigger('click', e); });
  
  this.trigger('init');
};







// Select elements in a similar fashion to jQuery without requiring it
Editor.prototype.s = function(selector, context){
  context = context || document;
  return (selector.nodeType) ? selector : context.querySelector(selector);
};

Editor.prototype.command = function(command, text){
  return document.execCommand(command, false, text);
};

