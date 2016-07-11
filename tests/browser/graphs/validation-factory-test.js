describe('Validation Factory', function () {
  beforeEach(module('Graphiti'));

  let ValidationFactory,
      testNum;

  beforeEach('Get factory', inject(function (_ValidationFactory_) {
    ValidationFactory = _ValidationFactory_;
  }));

  it('should be an object', function () {
    expect(ValidationFactory).to.be.an('object');
  });

  describe('validateNumber', function () {
    

    it('should be a function', function () {
      expect(ValidationFactory.validateNumber).to.be.a('function');
    });

    let nonNumbers = [{nonNum: 'one'}, 
                {nonNum: 'two'}, 
                {nonNum: 'three'}, 
                {nonNum: 'four'}],
        nonNumCol = {name: 'nonNum'},
        numbers = [{num: '1'}, 
                {num: '2'}, 
                {num: '3'}, 
                {num: '4'}],
        numCol = {name: 'num'},
        almostNumbers = [{thing: 'a1'}, 
                {thing: '2'}, 
                {thing: '3 in a million'}, 
                {thing: 'four'}],
        almostNumCol = {name: 'thing'};

    it('should return false for columns containing non-numbers', function () {
      expect(ValidationFactory.validateNumber(nonNumbers, nonNumCol)).to.equal(false);
    });

    it('should return true for columns containing numbers', function () {
      expect(ValidationFactory.validateNumber(numbers, numCol)).to.equal(true);
    });

    it('should return false for columns with any non-number data', function () {
      expect(ValidationFactory.validateNumber(almostNumbers, almostNumCol)).to.equal(false);
    });
  });
});
