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
(function(proto, virtual){

  var cleanBlock = text => text
    .replace(/\s*\n\s*/g, '')
    .replace(/^\s+/, '')
    .replace(/\s+$/, '');

  // This doesn't handle nested tags right now
  // We need childNodes for 'all' to have the text ones
  var children = tag => [].slice.call(tag.childNodes).reduce((tags, node, i, all) => {
    // It's not an element
    if (node.nodeType !== 1) return tags;
    if (node.nodeName === 'BR') return tags;

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

  proto.flatten = tags => Object.keys(tags).reduce((all, tag) => {
    var newTags = tags[tag].map(one => Object.assign(one, { type: tag }));
    return all.concat(newTags);
  }, []);

  proto.deduplicate = function(tags){
    var remove = [];
    return proto.flatten(tags).reduce((tags, tag, i, all) => {
      var dedup = tags.concat(all.map((against, j) => {
        if (remove.includes(i)) return;
        if (i === j) return tag;
        // x1 <= y2 && y1 <= x2
        if (tag.position <= against.position && against.position + against.size <= tag.position + tag.size) {
          remove.push(j);
          tag.tags = tag.tags || [];
          var shifted = against;
          shifted.position = against.position - tag.position;
          tag.tags.push(shifted);
          return tag;
        }
        return false;
      }).filter(n => n)[0]);
      return dedup;
    }, []).filter((n, i) => !remove.includes(i));
  }



  // Build each of the parts and put them together
  proto.build = function(){
    return JSON.parse(JSON.stringify(this.model)).map(part => Object.assign(part, {
      tags: proto.deduplicate(part.tags)
    })).map(virtual.build).join('');
  }

  proto.parse = function(html){
    return JSON.parse(JSON.stringify(
      u('<article>').html(cleanBlock(html)).children().nodes.map(node => ({
        type: node.nodeName.toLowerCase(),
        text: cleanBlock(node.textContent),
        tags: children(node)
      }))
    ));
  }

})(Editor.prototype, Editor.prototype.virtual);
