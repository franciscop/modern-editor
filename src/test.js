var expect = chai.expect;

describe('Initialization', function(){
  it('Loads', function(){
    new Editor('<div>');
  });
  it('Loads', function(){
    new Editor('<div>Bla');
  });
});
