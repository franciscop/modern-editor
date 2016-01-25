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

