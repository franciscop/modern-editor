
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
