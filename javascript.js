// Initialize the editor in the element that is contenteditable
var editor = new Editor("article");



// Register a new action called "bold"
editor.action.add("bold", {
  menu: "<strong>B</strong>", shortcut: "b",
  action: function() {
    this.command("bold");
  }
});

// Register a new action called "italic"
editor.action.add("italic", {
  menu: "<em>i</em>", shortcut: "i",
  action: function() {
    this.command("italic");
  }
});

// Register a new action called "link" with 
editor.action.add("link", {
  menu: "⚓", shortcut: "k",
  action: function() {
    var link = this.selection.element.getAttribute("href") || "";
    var address = prompt("Link address", link);
    if (address) {
      this.command('createLink', address);
    }
  }
});

// Register a new action called "italic"
editor.action.add("code", {
  menu: ">", shortcut: "`",
  action: function() {
    this.command("insertHtml", "<code>" + this.selection.text + "</code>");
  }
});


//editor.active(true);

  