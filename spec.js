// This file defines an API that would be nice, but it's not required

// Initialize the editor
var editor = new Editor("");

// Activate/deactivate the editor
editor.active(true || false);

// Set a new action
editor.action.add("", {
  shortcut: "" || {} || false,      // The key for Ctrl+key or { key: "esc" }
  menu: "" || {} || false,          // The html or icon to show
  init: function(){} || false,      // Called when activating an editor
  action: function(){} || false,    // Click or shortcut for that action
  destroy: function(){} || false    // Deactivating an editor
});

// The editor is initialized or re-activated
editor.on("init", function(){});

// Some action is triggered for any reason
editor.on("action", function(){});

// Registered action
editor.on("action:save", function(){});

// Special events
editor.on("action:before", function(){});
editor.on("action:pre", function(){});
editor.on("action:post", function(){});
editor.on("action:after", function(){});
editor.on("action:none", function(){});

// The editor is destroyed or de-activated
editor.on("destroy", function(){});


// The editor re-reads its data
editor.on("refresh", function(){});

// Some part of the editor is clicked or touched
editor.on("click", function(){});

// Some key is introduced (for example, "tab")
editor.on("key", function(){});

editor.on("select", function(){});



// Example (not part of the API)
editor.action.list = { actionname1: function(){}, actionname2: function(){} };
editor.menu.inline.list = { actionname1: "html1", actionname2: "html2" };
editor.menu.block.list = { actionname1: "html1", actionname2: "html2" };

editor.menu.list = {};

editor.shortcuts.list = { actionname1: { control: true, keyCode: 16 }, actionname2: { control: false, keyCode: 27 } };
editor.shortcuts.get(e);
