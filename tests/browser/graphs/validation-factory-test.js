describe('Validation Factory', function () {
  beforeEach(module('Graphiti'));

  let ValidationFactory;

  beforeEach('Get factory', inject(function (_ValidationFactory_) {
    ValidationFactory = _ValidationFactory_;
  }));

  it('should be an object', function () {
    expect(ValidationFactory).to.be.an('object');
  });
});