const { expect } = require('chai');

const { ErrorMessage, logoBase64 } = require("../config/config");

describe('ErrorMessage Function', () => {
    it('should return a JSON response with the provided message in production environment', () => {
        process.env.ENV_TYPE = 'prod';
        const res = {
            json: (data) => {
                expect(data).to.deep.equal({ message: 'Test Message' });
            }
        };
        ErrorMessage(res, null, 'Test Message');
    });

    it('should return a JSON response with the provided error in non-production environment', () => {
        process.env.ENV_TYPE = 'dev';

        const res = {
            json: (error) => {
                expect(error).to.be.an('object'); 
                expect(error.errorCode).to.equal(500); 
                expect(error.errorMessage).to.equal('Internal Server Error');
            }
        };

        ErrorMessage(res, { errorCode: 500, errorMessage: 'Internal Server Error' }, 'Test Message');
    });
});

describe('logoBase64 Function', () => {
    it('should return a base64-encoded PNG image string', () => {
        const result = logoBase64();
        expect(result).to.be.a('string').and.to.match(/^data:image\/png;base64,/);
    });
});
