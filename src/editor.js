// Modern Editor
// An event-based editor for the modern web
var Editor = function(selector, options){

  if (!(this instanceof Editor)) {
    return new Editor(selector, options);
  }

  // The instance's editor element (it is required)
  this.element = u(selector).first();
  if (!u(this.element).html().replace(/\s+/, '') || !u(this.element).children().length) {
    u(this.element).html('<p>');
  }

  //this.model = this.getContent(this.element);
  this.model = this.parse(this.element.innerHTML);
  //this.content = this.model.map(part => part.build()).join('');
  this.content = this.build();

  // Editor options
  options = options || {};
  options.delay = options.delay || 200;
  options.active = options.active !== undefined ? options.active : true;
  options.blocks = options.blocks || [];
  this.options = options;

  // Start each of the parts of the library
  this.menu(this.options.menu);

  this.selection();

  this.shortcuts();

  this.clean();

  this.default();

  var editor = this;
  window.setInterval(this.trigger.bind(this, 'refresh'), this.options.delay);
  this.element.addEventListener("blur", function(e){ editor.trigger('refresh', e); });

  // These are just good moments to refresh
  document.addEventListener("keydown", function(e){ editor.trigger('refresh', e); });
  document.addEventListener("mousedown", function(e){ editor.trigger('refresh', e); });
  document.addEventListener("touchstart", function(e){ editor.trigger('refresh', e); });
  document.addEventListener("click", function(e){ editor.trigger('refresh', e); });

  this.trigger('init');
};


Editor.prototype.defaults = function(options, def, wrap){

  // Based on defaults ( https://github.com/tmpvar/defaults )
  options = typeof options === 'object' ? options : {};

  // Clone it to avoid bad references
  def = JSON.parse(JSON.stringify(def || {}));

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


Editor.prototype.virtual = {};
