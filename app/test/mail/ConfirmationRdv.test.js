const { ConfirmationRdv } = require('../../mail/ConfirmationRdv');
const chai = require('chai');
const { expect } = chai;
describe('ConfirmationRdv.js test', () => {
    it('should return a string', () => {
        let string = ConfirmationRdv({CompteClient:{firstname:"test"},CompteExpert:{firstname:"test",lastname:"test"},DateDebut: new Date(),type:1},"userId","fr")
        expect(typeof string).to.equal('string');
    });
    it('should return a string starting with "<div"', () => {
        let string = ConfirmationRdv({CompteClient:{firstname:"test"},CompteExpert:{firstname:"test",lastname:"test"},DateDebut: new Date(),type:1},"userId","fr")
        expect(string.startsWith('<div ')).to.be.true;
    });
});