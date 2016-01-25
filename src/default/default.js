
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
