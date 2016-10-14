// Initialize the editor for the article
var editor = new Editor("article", { menu: "menu" });

// // When an element has only one child (no matter the type)
// editor.on('clean:single', function(node){
//   //console.log();
//   if (!u(node).is('pre') && u(node).children().is('code')) {
//     u(node).replace('pre');
//   }
//   if (u(node).is('pre') && !u(node).children().is('code')) {
//     u(node).replace('p');
//   }
// });
//
// // When an element has no content (it might have html though)
// editor.on('clean:empty', function(node){
//   //console.log(node);
// });



// A simple button
editor.add("bold", {
  menu: '<i class="icon-bold"></i>',
  shortcut: 'ctrl+b',
  action: function(){
    editor.command('bold');
  }
});

// A simple pop-up
editor.add("link", {
  menu: '<i class="icon-link"></i>',
  shortcut: 'ctrl+k',
  panel: '<div class="card">Hello</div>',
  action: function(){
    var link = editor.selection.element.getAttribute("href") || "";
    var address = prompt("Link address", link);
    editor.tag('a', (address ? { href: address } : false));
  }
});

// A simple dropdown
editor.add("type", {
  menu: {
    p: 'Paragraph',
    h2: 'Header 1',
    h3: 'Header 2',
    pre: 'Code block'
  },
  shortcut: 'ctrl+h',
  init: function(editor){
    editor.on('menu:show', function(){
      var item = editor.selection.element;
      if (!item) return;
      var name = item.nodeName.toLowerCase();
      if (!['p', 'h2', 'h3', 'pre'].includes(name)) name = 'p';
      editor.menu.elements.type.value = name;
      // var opts = u(editor.menu.elements.type.options).nodes.map(opt => opt.value);
      // if (!name || !opts.includes(name)) return;
    });
  },
  action: function(editor, value, e){
    editor.tag(value);
  }
});

editor.on('drop', function(editor, files, e){
  console.log(files[0]);
});




// // Add default actions like "bold", "italic", etc
// editor.add('default:bold', {
//   menu: '<strong>B</strong>', shortcut: "ctrl+b"
// });
//
// editor.add('default:italic', {
//   menu: '<em>i</em>', shortcut: "ctrl+i"
// });
//
// editor.add('default:link', {
//   menu: '<i class="icon-link"></i>', shortcut: "ctrl+k"
// });
//
// editor.add('default:code', {
//   menu: "<i class='icon-terminal'></i>", shortcut: "ctrl+`"
// });
//
// // Register a new action called "italic"
// editor.add('default:info', {
//   menu: "<i class='icon-help'></i>", shortcut: "ctrl+?"
// });
