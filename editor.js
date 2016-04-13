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





// Setup the drag and drop listeners.
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
});

/* mousetrap v1.5.3 craig.is/killing/mice */
(function(C,r,g){function t(a,b,h){a.addEventListener?a.addEventListener(b,h,!1):a.attachEvent("on"+b,h)}function x(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return l[a.which]?l[a.which]:p[a.which]?p[a.which]:String.fromCharCode(a.which).toLowerCase()}function D(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function u(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function y(a,b){var h,c,e,g=[];h=a;"+"===h?h=["+"]:(h=h.replace(/\+{2}/g,"+plus"),h=h.split("+"));for(e=0;e<h.length;++e)c=h[e],z[c]&&(c=z[c]),b&&"keypress"!=b&&A[c]&&(c=A[c],g.push("shift")),u(c)&&g.push(c);h=c;e=b;if(!e){if(!k){k={};for(var m in l)95<m&&112>m||l.hasOwnProperty(m)&&(k[l[m]]=m)}e=k[h]?"keydown":"keypress"}"keypress"==e&&g.length&&(e="keydown");return{key:c,modifiers:g,action:e}}function B(a,b){return null===a||a===r?!1:a===b?!0:B(a.parentNode,b)}function c(a){function b(a){a=
a||{};var b=!1,n;for(n in q)a[n]?b=!0:q[n]=0;b||(v=!1)}function h(a,b,n,f,c,h){var g,e,l=[],m=n.type;if(!d._callbacks[a])return[];"keyup"==m&&u(a)&&(b=[a]);for(g=0;g<d._callbacks[a].length;++g)if(e=d._callbacks[a][g],(f||!e.seq||q[e.seq]==e.level)&&m==e.action){var k;(k="keypress"==m&&!n.metaKey&&!n.ctrlKey)||(k=e.modifiers,k=b.sort().join(",")===k.sort().join(","));k&&(k=f&&e.seq==f&&e.level==h,(!f&&e.combo==c||k)&&d._callbacks[a].splice(g,1),l.push(e))}return l}function g(a,b,n,f){d.stopCallback(b,
b.target||b.srcElement,n,f)||!1!==a(b,n)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=x(a);b&&("keyup"==a.type&&w===b?w=!1:d.handleKey(b,D(a),a))}function l(a,c,n,f){function e(c){return function(){v=c;++q[a];clearTimeout(k);k=setTimeout(b,1E3)}}function h(c){g(n,c,a);"keyup"!==f&&(w=x(c));setTimeout(b,10)}for(var d=q[a]=0;d<c.length;++d){var p=d+1===c.length?h:e(f||
y(c[d+1]).action);m(c[d],p,f,a,d)}}function m(a,b,c,f,e){d._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var g=a.split(" ");1<g.length?l(a,g,b,c):(c=y(a,c),d._callbacks[c.key]=d._callbacks[c.key]||[],h(c.key,c.modifiers,{type:c.action},f,a,e),d._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:e,combo:a}))}var d=this;a=a||r;if(!(d instanceof c))return new c(a);d.target=a;d._callbacks={};d._directMap={};var q={},k,w=!1,p=!1,v=!1;d._handleKey=function(a,
c,e){var f=h(a,c,e),d;c={};var k=0,l=!1;for(d=0;d<f.length;++d)f[d].seq&&(k=Math.max(k,f[d].level));for(d=0;d<f.length;++d)f[d].seq?f[d].level==k&&(l=!0,c[f[d].seq]=1,g(f[d].callback,e,f[d].combo,f[d].seq)):l||g(f[d].callback,e,f[d].combo);f="keypress"==e.type&&p;e.type!=v||u(a)||f||b(c);p=l&&"keydown"==e.type};d._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)m(a[d],b,c)};t(a,"keypress",e);t(a,"keydown",e);t(a,"keyup",e)}var l={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",
20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},p={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},A={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},z={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},k;for(g=1;20>g;++g)l[111+g]="f"+g;for(g=0;9>=g;++g)l[g+96]=g;c.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};c.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};c.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};c.prototype.reset=function(){this._callbacks={};this._directMap=
{};return this};c.prototype.stopCallback=function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")||B(b,this.target)?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};c.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};c.init=function(){var a=c(r),b;for(b in a)"_"!==b.charAt(0)&&(c[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};c.init();C.Mousetrap=c;"undefined"!==typeof module&&module.exports&&(module.exports=
c);"function"===typeof define&&define.amd&&define(function(){return c})})(window,document);

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

  var self = this;
  this.clean.editor = this;
  this.clean.blocks = [];

  this.on('refresh', function(){
    this.trigger('clean');
  });

  // Clean up the html
  this.on('clean', function(){

    // Call the single elements
    u(this.element).children().singles(function(node){
      self.trigger('editor:clean:single', node);
    });

    u(this.element).children().empty(function(node){
      self.trigger('clean:empty', node);
    });
  });

  // Last defense for cleanup
  // Make sure all top-level elements are valid blocks or wrap them in <p>
  this.on('clean:post', function(){

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
// Add one of the events
Editor.prototype.on = function(name, callback){
  if (this.element) {
    u(this.element).on('editor:' + name, callback.bind(this));
  }
};

// Trigger one of the events
Editor.prototype.trigger = function(name, event){
  if (this.element) {
    u(this.element).trigger('editor:' + name + ':pre', event);
    u(this.element).trigger('editor:' + name, event);
    u(this.element).trigger('editor:' + name + ':post', event);
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
  var li = u('<li>').attr({
    'class': 'action',
    'title': element.title,
    'data-action': element.action
  }).on('click', function(e){
    e.preventDefault();
    editor.trigger('action');
    editor.trigger('action:' + element.action);
  }).html(element.html || "");
  u(this.element).append(li)
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
  editor.on("menu:add", function(e, element){
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
  editor.on("click", function(orig, e) {

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

