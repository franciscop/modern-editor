// Events
// Add one of the events
Editor.prototype.on = function(name, callback){
  if (this.element) {
    u(this.element).on('editor:' + name, callback.bind(this));
  }
};

// Trigger one of the events
Editor.prototype.trigger = function(name, event){
  if (this.element) {
    u(this.element).trigger('editor:' + name + ':pre', event);
    u(this.element).trigger('editor:' + name, event);
    u(this.element).trigger('editor:' + name + ':post', event);
  }
};
