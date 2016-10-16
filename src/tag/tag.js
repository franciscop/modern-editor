
// Tag
Editor.prototype.tag = function(name, attr){

  name = name.toLowerCase();

  var sel = this.selection.element;
  var selTag = sel.tagName.toLowerCase();

  // If the one we want to add is already added AND there're no attributes
  // if there's attributes we can assume that we want to change it, not delete it
  if (selTag === name && !attr) {

    // Don't allow including one tag into itself
    if (sel.textContent === this.selection.text) {
      this.selection.element.outerHTML = this.selection.text;
    } else {
      // Here it'd be nice to close previous tag and reopen it afterwards
    }
  } else {
    var className = "rggntymsdvshmuiersds";
    attr = attr || {};
    attr.class = attr.class ? attr.class + " " + className : className;
    var tag = "<" + name;
    for (var key in attr) {
      tag += " " + key + '="' + (attr[key] || "") + '"';
    }
    tag += ">" + this.selection.text + "</" + name + ">";

    try {
      var selwin = window.getSelection();
      this.command("insertHtml", tag);
    } catch(e){
      console.log("Error:", e);
    }

    var el = u('.' + className).first();
    if (!el) return;

    el.classList.remove(className);
    if (el.classList.length === 0) {
      el.removeAttribute('class');
    }

    var range = document.createRange();
    range.selectNodeContents(el);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  this.trigger('refresh');
};
