// Events
// All of the current events
Editor.prototype.events = {};

// Transparently redirect events to Umbrella
Editor.prototype.on = function(name, callback){
  u(this.element).on('editor:' + name, function(e) {
    return callback.apply(this, e.detail);
  });
};

// Handle event triggering with :before and :after
Editor.prototype.trigger = function(name){
  var data = [].slice.call(arguments, 1);
  var el = u(this.element);
  el.trigger.apply(el, ['editor:' + name + ':before'].concat(data));
  el.trigger.apply(el, ['editor:' + name].concat(data));
  el.trigger.apply(el, ['editor:' + name + ':after'].concat(data));
};
