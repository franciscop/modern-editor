// Menu
Editor.prototype.menu = function(name){
  
  // Default values
  this.menu.editor = this;
  this.menu.visible = false;
  
  // Class that will be added to the menu
  name = name || 'menu';

  // Add the menu to the DOM
  u('body').append('<ul class="' + name + '"></ul>');
  this.menu.element = u('.' + name).first();
  
  this.menu.events();
};



// Add an element to the menu
Editor.prototype.menu.add = function(element){
  var editor = this.editor;
  var li = u(document.createElement('li')).attr({
    'title': element.title,
    'data-action': element.action
  }).addClass('action').on('click', function(e){
    e.preventDefault();
    editor.trigger('action');
    editor.trigger('action:' + element.action);
  }).html(element.html).first();
  this.element.appendChild(li);
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
  editor.on("menu:add", function(element){
    menu.add(element);
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
  
  // On mousedown check whether or not we click on the menu
  editor.on("click", function (e) {
    
    // Don't unselect text when clicking on the menu
    if (menu.element && menu.element.contains(e.target)) {
      e.preventDefault();
    }
  });
}


