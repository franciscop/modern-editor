
Editor.prototype.clean = function(){
  var editor = this;
  this.clean.editor = this;

  this.on('refresh', function(){
    editor.trigger('clean');
  });

  // Clean up the html
  this.on('clean', function(){
    // Call the single elements
    u(this).children().singles(function(node){
      editor.trigger('clean:single', node);
    });

    u(this).children().empty(function(node){
      editor.trigger('clean:empty', node);
    });
  });

  // Last defense for cleanup
  // Make sure all top-level elements are valid blocks or wrap them in <p>
  this.on('clean:after', function(){

    var ed = u(editor.element);

    // Wrap any of the invalid blocks
    if (editor.clean.blocks) {
      ed.children().filter(editor.clean.filter).each(editor.clean.wrap);
    }

    if (!ed.children().nodes.length && ed.html() !== "") {
      ed.html('<p>' + ed.html() + '</p>');
    }
  });
}

Editor.prototype.clean.blocks = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'img', 'ul', 'ol'];

Editor.prototype.clean.filter = function(node){
  return Editor.prototype.clean.blocks.indexOf(node.nodeName.toLowerCase()) === -1;
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

// Retrieve all the nodes with no content
u.prototype.empty = function(callback){
  return this.filter(function(block){
    return !block.textContent.replace(/\s/, '').length;
  }).each(callback);
};

u.prototype.replace = function(el){
  this.each(function(node){
    node.parentNode.replaceChild(u('<p>').html(u(node).html()).first(), node);
  });
};

u.prototype.content = function(){
  return this.map(function(node){
    return this.slice(node.childNodes);
  });
};
