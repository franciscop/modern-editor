// Events
// All of the current events
Editor.prototype.events = {};

// Add one of the events
Editor.prototype.on = function(name, callback){
  //u(editor.element).on('editor:' + name, callback);
  if (!this.events[name]) this.events[name] = [];
  this.events[name].push(callback);
};

// Trigger one of the events
Editor.prototype.trigger = function(name, event){
  
  //u(editor.element).trigger('editor:' + name);
  
  if (this.events[name]) {
    this.trigger(name + ':before', event);
    
    this.events[name].forEach(function(callback){
      this.trigger(name + ':pre', event);
      callback.call(this, event);
      this.trigger(name + ':post', event);
    }, this);
    
    this.trigger(name + ':after', event);
  }
  else if (this.events[name + ':none']) {
    this.trigger(name + ':none', event);
  }
};


