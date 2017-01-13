describe('History', function(){
  it('Can register entries', function(){
    var editor = new Editor('<article><p>Zero</p></article>');
    editor.history.register(editor.parse('<p>First</p>'));
    editor.history.register(editor.parse('<p>Second</p>'));
    editor.history.register(editor.parse('<p>Third</p>'));
    expect(editor.build()).to.equal('<p>Third</p>');
  });

  it('Can go back one', function(){
    var editor = new Editor('<article><p>Zero</p></article>');
    editor.history.register(editor.parse('<p>First</p>'));
    editor.history.register(editor.parse('<p>Second</p>'));
    editor.history.register(editor.parse('<p>Third</p>'));
    editor.history.undo();
    expect(editor.build()).to.equal('<p>Second</p>');
  });
});
