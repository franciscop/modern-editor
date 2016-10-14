
Editor.prototype.default = function(){
  var self = this;

  this.on('action:default:italic', function(){
    self.command("italic");
  });

  this.on('action:default:bold', function(){
    self.command("bold");
  });

  this.on('action:default:link', function(){
    var link = u(self.selection.element).attr('href');
    var address = prompt("Link address", link || "");
    self.command(address ? 'createLink' : 'unlink', address);
  });

  this.on('action:default:code', function(){
    self.tag("code");
  });

  this.on('action:default:info', function(){
    window.open("https://github.com/franciscop/modern-editor", "_blank");
  });

  // Setup the drag and drop listeners.
  u(this.element).on('drop', function(e) {
    editor.trigger('drop', editor, e.dataTransfer.files, e);
  });
};
