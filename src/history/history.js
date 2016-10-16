// History, handle changes in the DOM
(function(history){

  var hash = str => str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0)
  , 0);

  history.entries = history.entries || [];
  history.undone = history.undone || [];

  // entry = { date: Date, model: {}, type: ''||false }
  history.register = function(type, date){
    var cursor = this.editor.selection.cursor(this.editor);
    var html = this.editor.element.innerHTML;
    var built = hash(html);
    var last = history.entries[history.entries.length - 1];
    // if (last && (cursor.index !== last.cursor.index || cursor.offset !== last.cursor.offset)) {
    //   history.entries[history.entries.length - 1].cursor = cursor;
    // }
    if (last && last.hash === built) return;
    var model = this.editor.parse(html);
    history.entries.push({
      model: model,
      type: type || 'none',
      date: date || new Date(),
      hash: built,
      cursor: cursor
    });
    this.editor.model = model;
    history.undone = [];
  };

  history.undo = function () {
    if (history.entries.length > 1) {
      var undone = history.entries.pop();
      var entry = history.entries.pop();
      this.editor.model = entry.model;
      this.editor.element.innerHTML = this.editor.build(this.editor.model);
      this.editor.selection.setCursor(entry.cursor);
      history.undone.push(undone);
      var undone = history.undone;
      history.register();
      history.undone = undone;
      //this.editor.selection.restore(history.entries[history.entries.length - 1].cursor);
    }
  }

  history.redo = function () {
    if (history.undone.length) {
      var entry = history.undone.pop();
      history.entries.push(entry);
      this.editor.model = entry.model;
      this.editor.element.innerHTML = this.editor.build(this.editor.model);
      this.editor.selection.setCursor(entry.cursor);
      //this.editor.selection.restore(history.entries[history.entries.length - 1].cursor);
    }
  }
})(Editor.prototype.history);
