const sum = require('./example');
// h1
describe('sum function', () => {
  // h2
  // describe()
  // test("",()=>{

  // })
  it('should return the sum of two numbers', () => {
    // prepare/arrange
    const a = 1;
    const b = 2;

    // execute/act
    const result = sum(a, b);

    // expect/assert
    expect(result).toBe(a + b);
  });
});
