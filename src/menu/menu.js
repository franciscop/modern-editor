// Menu

Editor.prototype.menu = function(name){
  this.menu.editor = this;
  this.menu.visible = false;

  // Class that will be added to the menu
  name = name || 'menu';

  // Add the menu to the DOM
  u('body').append('<ul class="' + name + '"></ul>');
  this.menu.element = u('.' + name).first();

  this.menu.events();
};

function generate(element, editor){
  var structure = element.html;

  var li = u('<li>').addClass('action').attr({
    title: element.title,
    'data-action': element.action
  });

  switch(element.type){
    case 'none':
      return li.html(element.html).first();
    case 'button':
      return li.addClass('simple').html(element.html).on('click', function(e){
        if (!element.defaults) {
          e.preventDefault();
        }
        editor.trigger('action');
        editor.trigger('action:' + element.action);
      }).first();
    case 'select':
      var select = u('<select>').append(function(key) {
        return '<option value="'+key+'">'+structure[key] +'</option>'
      }, Object.keys(structure)).on('change', function(e){
        editor.trigger('action');
        editor.trigger('action:' + element.action, e);
      });
      return li.addClass('select').append(select).first();
  };

  // Check if it's an object http://stackoverflow.com/a/22482737/938236
  if (structure === Object(structure)) {
    var list = u('<li class="dropdown action">').append().first();
    return list;
  }
  return('<a href="test">Hi there</a>');
}


// Add an element to the menu
Editor.prototype.menu.add = function(element, options){

  // Default options for the menu
  element = element.html ? element : {
    html: JSON.parse(JSON.stringify(element)),
    type: element.type || typeof element === 'string' ? 'button' : 'select'
  };
  element.type = element.type || 'none';
  element.title = (options.shortcut ? '[' + options.shortcut + '] ' : '') + options.name;
  element.action = element.action || options.name;

  var editor = this.editor;
  if (element instanceof Array) {
    element = element[0];
  }

  var item = generate(element, editor);
  this.element.appendChild(item);
  this.editor.menu.elements = this.editor.menu.elements || {};
  this.editor.menu.elements[element.action] = u(this.element).children().children().last();
}

// Add a separator between two elements from the menu
Editor.prototype.menu.separator = function(){
  u(this.element).append('<li class="separator">');
};


// Show the menu
Editor.prototype.menu.show = function(){

  if (this.editor.options.active) {
    this.element.style.display = 'block';
    this.element.visible = true;
    this.element.classList.add('visible');
  }
};

// Hide the menu
Editor.prototype.menu.hide = function(){
  this.element.style.display = "none";
  this.element.visible = false;
  this.element.classList.remove('visible');
};


// Calculate the position for the selection and move the menu to it
Editor.prototype.menu.move = function() {

  var selection = this.editor.selection.position;
  var doc = u('html').first().getBoundingClientRect();
  var menu = this.element.getBoundingClientRect();

  var top = selection.top - doc.top;
  if (top < 0 ) top = 0;
  var left = selection.left + selection.width / 2 - menu.width / 2;
  if (left < 0) left = 0;
  this.position = {
    top: top + "px",
    left: left + "px"
  };
  this.element.style.left = this.position.left;
  this.element.style.top = this.position.top;
};


Editor.prototype.menu.events = function(){

  var editor = this.editor;
  var menu = this;

  // Add a separator between two elements from the menu
  editor.on("menu:add", function(element, opt){
    menu.add.call(menu, element, opt);
  });

  // Add a separator between two elements from the menu
  editor.on("menu:separator", function(){
    menu.separator();
  });

  // Show the menu
  editor.on('menu:show', function(){
    menu.show();
  });

  // Hide the menu
  editor.on('menu:hide', function(){
    menu.hide();
  });

  // Position the menu correctly
  editor.on('menu:move', function(){
    menu.move();
  });

  // Avoid deselecting text when clicking on the menu
  u(menu.element).on('mousedown', function(e){
    // Only if it was not a select
    if (u(e.target).closest('select').length === 0) {
      e.preventDefault();
    }
  });

  // On mousedown check whether or not we click on the menu
  u('body').on("click", function (e) {

    // Don't unselect text when clicking on the menu
    if (menu.element && menu.element.contains(e.currentTarget)) {
      console.log("Prevented shortcut on click");
      e.preventDefault();
    }
  });
}
