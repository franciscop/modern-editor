// Initialize the editor for the article
var editor = new Editor("article", { menu: "menu" });





editor.add('undo', {
  shortcut: 'ctrl+z',
  action: editor => editor.history.undo()
});

editor.add('redo', {
  shortcut: 'ctrl+shift+z',
  action: editor => editor.history.redo()
});


u.prototype.styles = function(filter, not){
  var node = this.first();
  not = not || ['none', 'auto', '0px', 'normal', '0', '1'];

  var cs = window.getComputedStyle(node, null);

  if (!filter) {
    var len = cs.length;
    filter = [];
    for (var i=0;i<len;i++) {
      if (!cs[i].match(/^\-/))
        filter.push(cs[i]);
    }
  }

  return this.args(filter).reduce((all, key) => {
    var value = cs.getPropertyValue(key);
    if (value && !not.includes(value)) {
      all[key] = value;
    }
    return all;
  }, {});

}


u(editor.element).on('mouseover', e => {
  var pre = u(e.target).closest('pre');
  if (pre.length > 0) {
    var size = pre.size();

    var doc = u('html').size();
    var top = size.top - doc.top - size.height;
    if (top < 0 ) top = 0;
    var right = size.right - size.width;
    if (right < 0) right = 0;

    u(pre).append(`
      <div class="settings" style="top: ${top}px; right: ${right}px;">
        <i class="icon-cog"></i>
        <i class="icon-pencil"></i>
      </div>
    `);
  }
});

u(editor.element).on('mouseout', e => {
  u('.settings').remove();
});



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


editor.add("math", {
  menu: '<i class="icon-superscript"></i>',
  shortcut: 'ctrl+m',
  action: function () {
    function surroundSelectedText(templateElement){
      templateElement = u(templateElement).first();
      var ranges = sel.getAllRanges();
      var children = u().slice(u('article > *').nodes.map(node => node.textContent));
      console.log(sel, children[1]);
      console.log(children.filter(node => node === sel.anchorNode.textContent));
      var textNodes, textNode, el, i, len, j, jLen;
      for (i = 0, len = ranges.length; i < len; ++i) {
        range = ranges[i];
        // If one or both of the range boundaries falls in the middle
        // of a text node, the following line splits the text node at the
        // boundary
        range.splitBoundaries();

        // The first parameter below is an array of valid nodeTypes
        // (in this case, text nodes only)
        textNodes = range.getNodes([3]);

        for (j = 0, jLen = textNodes.length; j < jLen; ++j) {
          textNode = textNodes[j];
          el = templateElement.cloneNode(false);
          textNode.parentNode.insertBefore(el, textNode);
          el.appendChild(textNode);
        }
      }
    }

    var span = document.createElement("span");
    span.style.color = "green";
    span.style.fontWeight = "bold";

    surroundSelectedText('<strong>');
    console.log("Math");
  }
});


// A simple button
editor.add("bold", {
  menu: '<i class="icon-bold"></i>',
  shortcut: 'ctrl+b',
  action: function(){
    editor.command('bold');
    editor.history.register();
  }
});

// A simple pop-up
editor.add("link", {
  menu: '<i class="icon-link"></i>',
  shortcut: 'ctrl+k',
  panel: '<div class="card">Hello</div>',
  action: function(){
    editor.selection.save();
    u('form.link').on('submit', function(e){
      editor.selection.restore();
      e.preventDefault();
      var address = u('form.link input').first().value;
      editor.tag('a', (address ? { href: address } : false));
    });

    return;
    u('body').prepend('<form class="link"><input>');
    u('form.link input').first().focus();
    u('form.link').on('submit', function(e){
      e.preventDefault();
      var address = u('form.link input').first().value;
      u('form.link').remove();
      editor.selection.restore();
      editor.tag('a', (address ? { href: address } : false));
    });
    // var link = editor.selection.element.getAttribute("href") || "";
    // var address = prompt("Link address", link);
    // editor.tag('a', (address ? { href: address } : false));
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
