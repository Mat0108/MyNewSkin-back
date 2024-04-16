const { PasswordForgot } = require('../../mail/PasswordForgotMail.js');
const chai = require('chai');
const { expect } = chai;
describe('PasswordForgot.js test', () => {
    it('should return a string', () => {
        let string = PasswordForgot("resettoken","fr")
        expect(typeof string).to.equal('string');
    });
    it('should return a string starting with "<div"', () => {
        let string = PasswordForgot("resettoken","fr")
        expect(string.startsWith('<div ')).to.be.true;
    });
});