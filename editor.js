// Modern Editor
// An event-based editor for the modern web
var Editor = function(selector, options){
  
  
  // Based on defaults ( https://github.com/tmpvar/defaults )
  function defaults(options, def, wrap) {
    options = typeof options === 'object' ? options : {};
    
    Object.keys(def).forEach(function(key) {
      if (typeof options[key] === 'undefined') {
        options[key] = def[key];
      }
    });

    return options;
  }
  
  
  
  // INIT
  // Store a local instance
  var editor = this;
  
  // The instance's editor element (it is required)
  this.element = this.s(selector);
  if (!this.element) return false;
  
  // Options
  this.options = defaults(options, {
    
    // Class that will be added to the menu
    menu: 'menu',
    
    // Delay for each of the text selections checks (there's no event onselect)
    delay: 200,
    
    // Default active status
    active: true
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
  // Register a new action
  this.add = function(name, options){
    
    // Default options (empty functions)
    var fn = function(){};
    options = defaults(options, { init: fn, action: fn, destroy: fn });
    
    // Call the init action inmediately
    options.init.call(editor);
    
    // Add the action to the action event list like action:save
    editor.on('action:' + name, options.action.bind(editor, editor));
    
    // Add the action to the action event list like action:save
    editor.on('destroy', options.destroy.bind(editor));
    
    
    // Add the shortcut only if there is one
    editor.trigger('shortcut:add', { shortcut: options.shortcut, action: name });
    
    // Add the menu item only if there's one
    if (options.menu) {
      
      // Default options for the menu
      options.menu = defaults(options.menu, {
        html: options.menu,
        title: (options.shortcut ? '[' + options.shortcut + '] ' : '') + name,
        action: name
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
    
    li.classList.add('action');
    li.setAttribute('data-action', element.action);
    li.setAttribute('title', element.title);
    li.addEventListener("click", function(e) {
      e.preventDefault();
      editor.trigger('action');
      editor.trigger('action:' + element.action);
    });
    li.innerHTML = element.html;
    this.menu.element.appendChild(li);
  });
  
  
  this.on("menu:separator", function(){
    var li = document.createElement('li');
    li.classList.add('separator');
    this.menu.element.appendChild(li);
  });
  
  
  // Show the menu
  this.on('menu:show', function(){
    
    if (this.options.active) {
      this.menu.element.style.display = 'block';
      this.menu.element.visible = true;
      this.menu.element.classList.add('visible');
    }
  });
    
  // Hide the menu
  this.on('menu:hide', function(){
    this.menu.element.style.display = "none";
    this.menu.element.visible = false;
    this.menu.element.classList.remove('visible');
  });
  
  // Position the menu correctly
  this.on('menu:move', function(){
    var selection = this.selection.position;
    var doc = editor.s("html").getBoundingClientRect();
    var menu = editor.menu.element.getBoundingClientRect();
    
    // Delete the '60' to show it on the bottom
    var top = selection.top - doc.top;
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
    
    // Selected text
    this.selection.text = selection.toString();
    
    
    // Store the *right* element
    var node = selection.anchorNode;
    if (!this.selection.text || !node) {
      return false;
    }
    
    this.selection.element = node.nodeType == 1 ? node : node.parentElement;
    this.selection.range = selection.getRangeAt(0);
  });
  
  
  
  
  // SHORTCUTS
  this.shortcuts = [];
  
  this.on('shortcut:add', function(short){
    
    if (!short.shortcut) return false;
    
    short.keys = short.shortcut.split('+');
    
    //new Shortcut(short);
    this.shortcuts.push(short);
  });
  
  this.on("key", function(e){
    
    // Store the pressed key
    e[e.key.toLowerCase()] = true;
    
    // Normalize Mac's weird key
    e.ctrl = e.ctrlKey || e.metaKey;
    e.shift = e.shiftKey;
    e.alt = e.altKey;
    e.esc = e.keyCode == 27;
    
    function keyCode(short){
      return !short.keys.filter(function(key){ return !e[key]; }).length;
    }
    
    var shortcut = editor.shortcuts.filter(keyCode);
    shortcut.forEach(function(short){
      if (!shortcut.default) {
        e.preventDefault();
      }
      editor.trigger('shortcut', short);
    });
  });
  
  this.on("shortcut", function(short){
    editor.trigger('action');
    editor.trigger('action:' + short.action);
  });
  
  this.on("key", function(e){
    this.trigger('refresh', e);
  });
  
  
  
  
  
  window.setInterval(editor.trigger.bind(this, 'refresh'), this.options.delay);
  this.element.addEventListener("blur", function(e){ editor.trigger('refresh', e); });
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
  document.execCommand(command, false, text);
  this.trigger('refresh');
};

Editor.prototype.tag = function(name, attr){
  
  name = name.toLowerCase();
  
  var sel = this.selection.element;
  var selTag = sel.tagName.toLowerCase();
  
  // If the one we want to add is already added AND there're no attributes
  // if there's attributes we can assume that we want to change it, not delete it
  if (selTag === name && !attr) {
    
    // Don't allow including one tag into itself
    if (sel.textContent === this.selection.text) {
      this.selection.element.outerHTML = this.selection.text;
    } else {
      // Here it'd be nice to close previous tag and reopen it afterwards
    }
  } else {
    var className = "rggntymsdvshmuiersds";
    attr = attr || {};
    attr.class = attr.class ? attr.class + " " + className : className;
    var tag = "<" + name;
    for (var key in attr) {
      tag += " " + key + '="' + (attr[key] || "") + '"';
    }
    tag += ">" + this.selection.text + "</" + name + ">";
    this.command("insertHtml", tag);
    
    var el = this.s('.' + className);
    el.classList.remove(className);
    if (el.classList.length === 0)
      el.removeAttribute('class');
    
    range = document.createRange();
    range.selectNodeContents(el);
    
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  this.trigger('refresh');
};

