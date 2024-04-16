const { ConfirmationClient } = require('../../mail/ConfirmationClient');
const chai = require('chai');
const { expect } = chai;
describe('ConfirmationClient.js test', () => {
    it('should return a string', () => {
        let string = ConfirmationClient("test","userId","fr")
        expect(typeof string).to.equal('string');
    });
    it('should return a string starting with "<div"', () => {
        let string = ConfirmationClient("test","userId","fr")
        expect(string.startsWith('<div ')).to.be.true;
    });
});