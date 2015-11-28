// Initialize the editor in the element that is contenteditable
var editor = new Editor("article");

// Register a new action called "bold"
editor.add("bold", {
  menu: "<strong>B</strong>", shortcut: "ctrl+b",
  action: function(editor) {
    editor.command("bold");
  }
});

// Register a new action called "italic"
editor.add("italic", {
  menu: "<i>i</i>", shortcut: "ctrl+i",
  action: function(editor) {
    editor.command("italic");
  }
});

// Register a new action called "link"
editor.add("link", {
  menu: "<i class='icon-link'></i>", shortcut: "ctrl+k",
  action: function(editor) {
    var link = editor.selection.element.getAttribute("href") || "";
    var address = prompt("Link address", link);
    if (address) {
      editor.tag('a', { href: address });
    } else {
      editor.tag('a');
    }
  }
});

editor.add("code", {
  menu: "<i class='icon-terminal'></i>", shortcut: "ctrl+`",
  action: function(editor) {
    editor.tag("code");
  }
});

// Register a new action called "italic"
editor.add('info', {
  menu: "<i class='icon-help'></i>",
  action: function(editor){
    window.open("https://github.com/franciscop/modern-editor", "_blank");
  }
});


  