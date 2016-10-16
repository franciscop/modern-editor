// Virtual, a small virtual DOM representation for text content
(function(virtual){

  virtual.clean = text => text.replace(/^\s+/, '').replace(/\s+$/, '');

  // Build the tags
  var tags = {
    attrs: attrs => attrs
      ? ' ' + Object.keys(attrs).map(key => `${key}="${attrs[key]}"`).join(' ')
      : '',
    open: data => `<${data.type}${tags.attrs(data.attributes)}>`,
    close: data => `</${data.type}>`
  };

  var desc = (a, b) => b.position - a.position;

  // Tag a piece of text with the passed tags in the correct positions:
  // ('this is Sparta', [{ position: 5, size: 2, type: 'strong' }]) =>
  // 'this <strong>is</strong> Sparta'
  // End to front; so it handles the spaces and nesting correctly
  virtual.tag = (text, tags = []) => tags.sort(desc).reduce((text, tag) =>
    text.slice(0, tag.position) + virtual.build(Object.assign(tag, {
      text: text.slice(tag.position, tag.position + tag.size)
    })) + text.slice(tag.position + tag.size)
  , text);

  // Top level builder that doesn't care about low-level stuff
  virtual.build = e => tags.open(e) + virtual.tag(e.text || '', e.tags) + tags.close(e);

})(Editor.prototype.virtual);
