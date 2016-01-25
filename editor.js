// Modern Editor
// An event-based editor for the modern web
var Editor = function(selector, options){
  
  // The instance's editor element (it is required)
  this.element = u(selector).first();
  
  // Editor options
  this.options = this.defaults(options, {
    
    // Delay for each of the text selections checks (there's no event onselect)
    delay: 200,
    
    // Default active status
    active: true,
    
    // The valid blocks
    blocks: []
  });
  
  
  // Start each of the parts of the library
  this.menu(this.options.menu);
  
  this.selection();
  
  this.shortcuts();
  
  this.clean();
  
  this.default();
  
  var editor = this;
  window.setInterval(this.trigger.bind(this, 'refresh'), this.options.delay);
  this.element.addEventListener("blur", function(e){ editor.trigger('refresh', e); });
  document.addEventListener("keydown", function(e){ editor.trigger('key', e); });
  document.addEventListener("mousedown", function(e){ editor.trigger('click', e); });
  document.addEventListener("touchstart", function(e){ editor.trigger('click', e); });
  document.addEventListener("click", function(e){ editor.trigger('click', e); });
  
  this.trigger('init');
};


Editor.prototype.defaults = function(options, def, wrap){
  
  // Based on defaults ( https://github.com/tmpvar/defaults )
  options = typeof options === 'object' ? options : {};
  
  Object.keys(def).forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      options[key] = def[key];
    }
  });

  return options;
};


Editor.prototype.command = function(command, text){
  document.execCommand(command, false, text);
  this.trigger('refresh');
};

// Initialization
u.prototype.editor = function(options){
  return new Editor(this.first(), options);
};
















// Setup the dnd listeners.
u('body').on('drop', function(e) {
  
  var data = new FormData();
  data.append("image", e.dataTransfer.files[0]);
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload', true);
  
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      var percentComplete = (e.loaded / e.total) * 100;
      console.log(percentComplete + '% uploaded');
    }
  };
  xhr.onload = function() {
    if (this.status == 200) {
      console.log("Success");
    };
  };
  xhr.send(data);
  
  

  // var files = e.dataTransfer.files; // FileList object.
  // 
  // //files is a FileList of File objects. List some properties.
  // for (var i = 0, f; f = files[i]; i++) {
  //   console.log('"' + f.name + '" (' + (f.type || 'n/a') + ')');
  //   console.log(f.size + ' bytes');
  //   console.log('last modified: ' + (f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'));
  // }
});


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


Editor.prototype.clean = function(){
  
  this.clean.editor = this;
  this.clean.blocks = [];
  
  this.on('refresh', function(){
    this.trigger('clean');
  });
  
  // Clean up the html
  this.on('clean', function(){
    
    // Call the single elements
    u(this.element).children().singles(function(node){
      editor.trigger('clean:single', node);
    });
    
    u(this.element).children().empty(function(node){
      editor.trigger('clean:empty', node);
    });
  });
  
  // Last defense for cleanup
  // Make sure all top-level elements are valid blocks or wrap them in <p>
  this.on('clean:after', function(){
    
    var ed = u(editor.element);
    
    // Wrap any of the invalid blocks
    if (this.options.blocks) {
      ed.children().filter(this.clean.filter).each(this.clean.wrap);
    }
    
    if (!ed.children().nodes.length && ed.html() !== "") {
      ed.html('<p>' + ed.html() + '</p>');
    }
  });
}

Editor.prototype.clean.filter = function(node){
  return this.editor.options.blocks.indexOf(node.nodeName.toLowerCase()) === -1;
};

Editor.prototype.clean.wrap = function(node){
  var p = document.createElement('p');
  p.innerHTML = node.outerHTML;
  node.parentNode.replaceChild(p, node);
};



// Retrieve all the nodes with only one child, whatever the type
u.prototype.singles = function(callback){
  return this.filter(function(block){
    return u(block).content().nodes.length == 1;
  }).each(callback);
};

// Retrieve all the nodes with only one child, whatever the type
u.prototype.empty = function(callback){
  return this.filter(function(block){
    return !block.textContent.replace(/\s/, '').length;
  }).each(callback);
};

u.prototype.replace = function(el){
  this.each(function(node){
    var p = document.createElement(el);
    p.innerHTML = node.innerHTML;
    node.parentNode.replaceChild(p, node);
  });
};

u.prototype.wrap = function(el){
  this.each(function(node){
    var p = document.createElement(el);
    p.innerHTML = node.outerHTML;
    node.parentNode.replaceChild(p, node);
  });
};

u.prototype.content = function(){
  
  var self = this;
  
  return this.join(function(node){
    return self.slice(node.childNodes);
  });
};

Editor.prototype.default = function(){
  
  this.on('action:default:italic', function(){
    this.command("italic");
  });
  
  this.on('action:default:bold', function(){
    this.command("bold");
  });
  
  this.on('action:default:link', function(){
    var link = u(this.selection.element).attr('href');
    var address = prompt("Link address", link || "");
    this.command(address ? 'createLink' : 'unlink', address);
  });
  
  this.on('action:default:code', function(){
    this.tag("code");
  });
  
  this.on('action:default:info', function(){
    window.open("https://github.com/franciscop/modern-editor", "_blank");
  });
  
};

// Events
// All of the current events
Editor.prototype.events = {};

// Add one of the events
Editor.prototype.on = function(name, callback){
  //u(editor.element).on('editor:' + name, callback);
  if (!this.events[name]) this.events[name] = [];
  this.events[name].push(callback);
};

// Trigger one of the events
Editor.prototype.trigger = function(name, event){
  
  //u(editor.element).trigger('editor:' + name);
  
  if (this.events[name]) {
    this.trigger(name + ':before', event);
    
    this.events[name].forEach(function(callback){
      this.trigger(name + ':pre', event);
      callback.call(this, event);
      this.trigger(name + ':post', event);
    }, this);
    
    this.trigger(name + ':after', event);
  }
  else if (this.events[name + ':none']) {
    this.trigger(name + ':none', event);
  }
};



// Menu
Editor.prototype.menu = function(name){
  
  // Default values
  this.menu.editor = this;
  this.menu.visible = false;
  
  // Class that will be added to the menu
  name = name || 'menu';

  // Add the menu to the DOM
  u('body').append('<ul class="' + name + '"></ul>');
  this.menu.element = u('.' + name).first();
  
  this.menu.events();
};



// Add an element to the menu
Editor.prototype.menu.add = function(element){
  var editor = this.editor;
  var li = u(document.createElement('li')).attr({
    'title': element.title,
    'data-action': element.action
  }).addClass('action').on('click', function(e){
    e.preventDefault();
    editor.trigger('action');
    editor.trigger('action:' + element.action);
  }).html(element.html).first();
  this.element.appendChild(li);
}

// Add a separator between two elements from the menu
Editor.prototype.menu.separator = function(){
  u(this.element).append('<li class="separator">');
};


// Show the menu
Editor.prototype.menu.show = function(){
  
  if (this.editor.options.active) {
    this.element.style.display = 'block';
    this.element.visible = true;
    this.element.classList.add('visible');
  }
};
  
// Hide the menu
Editor.prototype.menu.hide = function(){
  this.element.style.display = "none";
  this.element.visible = false;
  this.element.classList.remove('visible');
};


// Calculate the position for the selection and move the menu to it
Editor.prototype.menu.move = function() {
  
  var selection = this.editor.selection.position;
  var doc = u('html').first().getBoundingClientRect();
  var menu = this.element.getBoundingClientRect();
  
  var top = selection.top - doc.top;
  if (top < 0 ) top = 0;
  var left = selection.left + selection.width / 2 - menu.width / 2;
  if (left < 0) left = 0;
  this.position = {
    top: top + "px",
    left: left + "px"
  };
  this.element.style.left = this.position.left;
  this.element.style.top = this.position.top;
};


Editor.prototype.menu.events = function(){
  
  var editor = this.editor;
  var menu = this;
  
  // Add a separator between two elements from the menu
  editor.on("menu:add", function(element){
    menu.add(element);
  });

  // Add a separator between two elements from the menu
  editor.on("menu:separator", function(){
    menu.separator();
  });

  // Show the menu
  editor.on('menu:show', function(){
    menu.show();
  });
    
  // Hide the menu
  editor.on('menu:hide', function(){
    menu.hide();
  });

  // Position the menu correctly
  editor.on('menu:move', function(){
    menu.move();
  });
  
  // On mousedown check whether or not we click on the menu
  editor.on("click", function (e) {
    
    // Don't unselect text when clicking on the menu
    if (menu.element && menu.element.contains(e.target)) {
      e.preventDefault();
    }
  });
}




// SELECTION
Editor.prototype.selection = function(){
  this.selection.element = false;
  this.selection.text = "";
  
  
  // Format nicely the code (if needed)
  this.on('refresh', function(){
      
    var html = this.element.innerHTML;
    if (!html || html.match(/^\s+$/) || html.match(/^<br\/?>$/)) {
      this.command("insertParagraph");
      var br = this.element.querySelector("br");
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
    this.selection.position = this.selection.range.getBoundingClientRect();
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
  
  this.on("click", function(e){
    this.trigger('refresh', e);
  });
};

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
    
    var el = u('.' + className).first();
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

