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