
describe('Represents html correctly', function(){
  it('handles a simple div', function(){
    var div = u('<div><p>').first();
    var editor = new Editor(div);
    expect(editor.model[0]).to.be.an('object');
    expect(editor.model[0]).to.include.keys('type', 'text', 'tags');
  });

  var htmls = [
    `<p></p>`,
    `<p>Simple sentence</p>`,
    `<p>This <strong>is</strong> Sparta</p>`,
    `<p><a href="/bla">a</a></p>`,
    `<p>This <strong>handles</strong> both of <em>tags</em></p>`,
    `<p>This <a>is a <strong>very</strong> big</a>test</p>`,
    `<p>A<a>This <strong>is</strong> a <em>very</em> big</a> test</p>`,
    // `<p>A<a>This <strong>is <em>a</em> very</strong> big</a>test</p>`,
    [
      `<p>Simple sentence with spaces</p>   `,
      `<p>Simple sentence with spaces</p>`
    ]
  ];

  htmls.forEach(function(html, i){
    html = html instanceof Array ? html : [html];
    it((i + 1) + '/' + htmls.length + ' : "' + html[0] + '"', function(){
      if (html.length > 1) {
        var div = u('<article>' + html[0]).first();
        var editor = new Editor(div);
        expect(editor.build()).to.equal(html[1]);
      } else {
        var div = u('<article>' + html).first();
        var editor = new Editor(div);
        expect(editor.build()).to.equal(html[0]);
      }
    });
  });
});



// editor.virtual.build({ type: 'a', attributes: { href: '/bla' }, text: 'bla', tags: [] });
// editor.virtual.parse('<a href="">Bla</a>');
describe('Virtual DOM builder', function(){
  var editor = new Editor('<article>');

  it('block:empty', function(){
    var model = { type: 'p' };
    var built = editor.virtual.build(model);
    expect(built).to.equal('<p></p>');
  });

  it('block:text', function(){
    var model = { type: 'p', text: 'Hello world' };
    var built = editor.virtual.build(model);
    expect(built).to.equal('<p>Hello world</p>');
  });

  it('attributes:one', function(){
    var model = {
      type: 'a',
      text: 'Hello world',
      attributes: { href: '/hello' }
    };
    var built = editor.virtual.build(model);
    expect(built).to.equal('<a href="/hello">Hello world</a>');
  });

  it('attributes:many', function(){
    var model = {
      type: 'a',
      text: 'Hello world',
      attributes: { href: '/hello', target: '_blank' }
    };
    var built = editor.virtual.build(model);
    expect(built).to.equal('<a href="/hello" target="_blank">Hello world</a>');
  });

  it('attributes:empty', function(){});

  it('tags:one', function(){
    var tagged = editor.virtual.tag('This is some text', [{
      type: 'strong',
      position: 5,
      size: 7
    }]);
    expect(tagged).to.equal('This <strong>is some</strong> text');
  });

  it('tags:asc', function(){
    var tagged = editor.virtual.tag('This is some big text', [
      { type: 'a', position: 13, size: 3 },
      { type: 'em', position: 8, size: 4 },
      { type: 'strong', position: 5, size: 2 },
    ]);
    expect(tagged).to.equal('This <strong>is</strong> <em>some</em> <a>big</a> text');
  });

  it('tags:desc', function(){
    var tagged = editor.virtual.tag('This is some big text', [
      { type: 'strong', position: 5, size: 2 },
      { type: 'em', position: 8, size: 4 },
      { type: 'a', position: 13, size: 3 },
    ]);
    expect(tagged).to.equal('This <strong>is</strong> <em>some</em> <a>big</a> text');
  });

  it('tags:attrs', function(){
    var tagged = editor.virtual.tag('This is some big text', [
      { type: 'a', attributes: { href: '/bla' }, position: 13, size: 3 },
      { type: 'em', position: 8, size: 4 },
      { type: 'strong', position: 5, size: 2 },
    ]);
    expect(tagged).to.equal('This <strong>is</strong> <em>some</em> <a href="/bla">big</a> text');
  });

  it('tags:nested', function(){
    var tagged = editor.virtual.tag('This is some good text', [{
      type: 'strong', position: 5, size: 12,
      tags: [
        { type: 'em', position: 3, size: 4 }
      ]
    }]);
    expect(tagged).to.equal('This <strong>is <em>some</em> good</strong> text');
  });
});

describe('Virtual DOM parser', function(){
  var editor = new Editor('<article>');

  it('Can clean stuff', function(){
    var clean = editor.virtual.clean('  a ');
    expect(clean).to.equal('a');
  });
});
