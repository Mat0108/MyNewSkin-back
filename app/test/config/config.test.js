const { expect } = require('chai');

const { logoBase64 } = require("../../config/config");

describe('logoBase64 Function', () => {
    it('should return a base64-encoded PNG image string', () => {
        const result = logoBase64();
        expect(result).to.be.a('string').and.to.match(/^data:image\/png;base64,/);
    });
});
