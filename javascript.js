// Initialize the editor for the article
var editor = u('article').editor({
  blocks: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'img', 'ul', 'ol']
});

// When an element has only one child (no matter the type)
editor.on('clean:single', function(node){
  //console.log();
  if (!u(node).is('pre') && u(node).children().is('code')) {
    u(node).replace('pre');
  }
  if (u(node).is('pre') && !u(node).children().is('code')) {
    u(node).replace('p');
  }
});

// When an element has no content (it might have html though)
editor.on('clean:empty', function(node){
  //console.log(node);
});


// Add default actions like "bold", "italic", etc
editor.add('default:bold', {
  menu: '<strong>B</strong>', shortcut: "ctrl+b"
});

editor.add('default:italic', {
  menu: '<em>i</em>', shortcut: "ctrl+i"
});

editor.add('default:link', {
  menu: '<i class="icon-link"></i>', shortcut: "ctrl+k"
});

editor.add('default:code', {
  menu: "<i class='icon-terminal'></i>", shortcut: "ctrl+`"
});

// Register a new action called "italic"
editor.add('default:info', {
  menu: "<i class='icon-help'></i>", shortcut: "ctrl+?"
});





