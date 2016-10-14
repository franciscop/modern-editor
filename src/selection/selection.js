
// SELECTION
Editor.prototype.selection = function(){
  var editor = this;
  this.selection.element = false;
  this.selection.text = "";


  // Format nicely the code (if needed)
  this.on('refresh', function(){

    u(this).children('br').remove();
    if (u(this).html().match(/^\s*$/)) {
      editor.command("insertParagraph");
    }
  });

  // Display/hide the menu
  this.on('refresh', function(){

    var prev = editor.selection.text;
    editor.trigger('select:check');
    var post = editor.selection.text;

    // If the selections has changed
    if (prev != post) {
      editor.trigger('select');
    }
  });

  this.on('select', function(){
    editor.selection.position = editor.selection.range.getBoundingClientRect();
  });

  // When the selection changes, check its value
  this.on('select', function(){

    var selected = editor.selection.text;
    var hidden = editor.menu.element.style.display !== 'block';

    if (selected && hidden) {
      editor.trigger('menu:show');
    }

    if (selected) {
      editor.trigger('menu:move');
    }

    if (!selected && !hidden) {
      editor.trigger('menu:hide');
    }
  });

  this.on('select:check', function(){

    // The selection from the current window
    var selection = window.getSelection();

    // Selected text
    editor.selection.text = selection.toString();


    // Store the *right* element
    var node = selection.anchorNode;
    if (!editor.selection.text || !node) {
      return false;
    }

    editor.selection.element = node.nodeType == 1 ? node : node.parentElement;
    editor.selection.range = selection.getRangeAt(0);
  });
};
