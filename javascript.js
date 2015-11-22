// Initialize the editor in the element that is contenteditable
var editor = new Editor("article");

// Register a new action called "bold"
editor.add("bold", {
  menu: "<strong>B</strong>", shortcut: "ctrl+b",
  action: function() {
    this.command("bold");
  }
});

// Register a new action called "italic"
editor.add("italic", {
  menu: "<em>i</em>", shortcut: "ctrl+i",
  action: function() {
    this.command("italic");
  }
});

// Register a new action called "link" with 
editor.add("link", {
  menu: "⚓", shortcut: "ctrl+k",
  action: function() {
    var link = this.selection.element.getAttribute("href") || "";
    var address = prompt("Link address", link);
    if (address) {
      this.command('createLink', address);
    }
  }
});

// Register a new action called "italic"
editor.add("code", {
  menu: ">", shortcut: "ctrl+`",
  action: function() {
    this.command("insertHtml", "<code>" + this.selection.text + "</code>");
  }
});

// Register a new action called "italic"
editor.on('action:cancel', function(){
  this.trigger('menu:hide');
});
editor.trigger('shortcut:add', { shortcut: 'esc', action: 'cancel' });


  