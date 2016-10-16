
// SELECTION
Editor.prototype.selection = function(){
  var editor = this;
  this.selection.editor = this;
  this.selection.element = false;
  this.selection.elements = [];
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
    console.log('triggered', selected, hidden);
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

Editor.prototype.selection.save = function(){

  var editor = this.editor;

  // Selected text
  var selected = window.getSelection();
  editor.selection.saved = {};
  for (var key in selected) {
    editor.selection.saved[key] = selected[key];
  }
}

Editor.prototype.selection.restore = function () {
  var editor = this.editor;

  if (!editor || !editor.selection.saved) return;

  var saved = editor.selection.saved;

  console.log("Saved:", saved);
  range = document.createRange();
  range.setStart(saved.anchorNode, saved.anchorOffset);
  range.setEnd(saved.focusNode, saved.focusOffset);
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

Editor.prototype.selection.cursor = function(editor){
  var selected = window.getSelection();
  var anchor = selected.anchorNode;
  while (anchor && anchor.nodeType !== 1) {
    anchor = anchor.parentNode;
  }
  return {
    index: u(editor.element).children().nodes.indexOf(anchor),
    offset: selected.anchorOffset
  };
}

Editor.prototype.selection.setCursor = function(saved){
  this.editor.element.focus();
  range = document.createRange();
  var div = u(this.editor.element).children().nodes[saved.index];
  if (!div) return;
  var child = div.childNodes[0];
  if (!child) return;
  range.setStart(child, saved.offset);
  range.setEnd(child, saved.offset);
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}





//   this.editor.element.focus();
//   var sel = window.getSelection();
//   var range = sel.getRangeAt(0);
//   var sC=this.editor.element;
//   var eC=this.editor.element;
//
//   var C = rp.sC;
//   var x = C.length;
//   while(x--) {
//     sC = sC.childNodes[C[x]];
//   }
//   var C = rp.eC;
//   var x = C.length;
//   while(x--) {
//     eC=eC.childNodes[C[x]];
//   }
//
//   range.setStart(sC,rp.sO);
//   range.setEnd(eC,rp.eO);
//   sel.removeAllRanges();
//   sel.addRange(range)
// }
