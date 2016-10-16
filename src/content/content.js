// Convert HTML to this format:
// var content = [{
//   type: 'h1',
//   text: 'Modern Editor',
//   tags: {}
// }, {
//   type: 'p',
//   text: 'This is an event-based rich text editor for the modern web',
//   tags: {
//     strong: [
//       { position: 23, size: 50 }
//     ],
//     a: [
//       { position: 23, size; 50, attributes: { href: 'https://google.com/' } }
//     ]
//   }
// }];
(function(proto){

  var cleanBlock = text => text
    .replace(/\s*\n\s*/g, '')
    .replace(/^\s+/, '')
    .replace(/\s+$/, '');

  // This doesn't handle nested tags right now
  // We need childNodes for 'all' to have the text ones
  var children = tag => [].slice.call(tag.childNodes).reduce((tags, node, i, all) => {
    // It's not an element
    if (node.nodeType !== 1) return tags;

    var before = all.slice(0, i).map(one => one.textContent).join('');

    var grandchildren = children(node);
    for (var key in grandchildren) {
      grandchildren[key].forEach(part => {
        tags[key] = tags[key] || [];
        tags[key].push(Object.assign(part, {
          position: part.position + before.length
        }));
      });
    }

    var attributes = false;
    if (node.attributes.length) {
      attributes = {};
      for (var i = 0; i < node.attributes.length; i++) {
        attributes[node.attributes[i].nodeName] = node.attributes[i].value;
      }
    }
    var name = node.nodeName.toLowerCase();
    tags[name] = tags[name] || [];
    tags[name].push({
      position: before.length,
      size: node.textContent.length,
      attributes: attributes
    });
    return tags;
  }, { a: [], strong: [], em: [] });

  var flatten = tags => Object.keys(tags).reduce((all, tag) => {
    var newTags = tags[tag].map(one => Object.assign(one, { type: tag }));
    return all.concat(newTags);
  }, []);

  var remove = [];
  var deduplicate = tags => tags.reduce((tags, tag, i, all) => {
    var dedup = tags.concat(all.map((against, j) => {
      if (remove.includes(i)) return;
      if (i === j) return tag;
      // x1 <= y2 && y1 <= x2
      if (tag.position <= against.position && against.position + against.size <= tag.position + tag.size) {
        // TODO: DEDUPLICATE THE NODES HERE
        remove.push(j);
        tag.nested = tag.nested || [];
        var shifted = against;
        shifted.position = against.position - tag.position;
        tag.nested.push(shifted);
        return tag;
      }
      return false;
    }).filter(n => n)[0]);
    return dedup;
  }, []).filter((n, i) => !remove.includes(i));


  var nested = (text, tag) => {
    //if (tag.nested) return(nested(text, tag));
    // 'string', tag
    var buildOpt = {
      type: false,
      text: text,
      tags: tag.map(tag => ({
        type: tag.type,
        position: tag.position,
        size: tag.size
      }))
    };
    var built = proto.build(buildOpt);
    return built;
  }


  var attrs = (attrs) => attrs ? ' ' + Object.keys(attrs).map(key =>
    `${key}="${attrs[key]}"`
  ).join(' ') : '';


  // data = { text: "blabla", tags: [ { type: 'a', size: 5, position: 10 } ] }
  proto.build = data => {
    var text = data.text;
    var tags = data.tags || [];
    tags = tags.sort((a, b) => a.position - b.position);
    // End to front; so it handles the spaces and nesting correctly
    for (var i = tags.length -1; i >= 0; i--) {
      var tag = tags[i];
      var before = text.slice(0, tag.position);
      var middle = text.slice(tag.position, tag.position + tag.size);
      tag.text = tag.nested ? nested(middle, tag.nested) : middle
      var after = text.slice(tag.position + tag.size);
      text = before + proto.build(tag) + after;
    }
    var attributes = attrs(data.attributes);
    return data.type ? `<${data.type}${attributes}>${text}</${data.type}>` : text;
  };



  proto.getContent = function(element){

    var root = u('<article>').html(cleanBlock(element.innerHTML)).first();

    return u(root).children().nodes.map(node => ({
      type: node.nodeName.toLowerCase(),
      text: cleanBlock(node.textContent),
      tags: children(node),
      build: function(){
        return proto.build({
          type: this.type,
          text: this.text,
          tags: deduplicate(flatten(this.tags))
        });
      }
    }));
  };

})(Editor.prototype);
