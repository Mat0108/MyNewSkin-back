const { expect } = require('chai');
const { ErrorMessage, DiagnosticData } = require('../controllers/Message.js');

describe('ErrorMessage function', () => {
  it('should return JSON with message in production environment', () => {
    const mockResponse = {
      json: data => {
        expect(data).to.have.property('message');
        expect(data.message).to.equal('your_expected_message');
      }
    };
    ErrorMessage(mockResponse, null, 'your_expected_message');
  });

  it('should return JSON with error in non-production environment', () => {
    process.env.ENV_TYPE = 'dev'; // Set the environment to non-production
    const mockResponse = {
      json: data => {
        expect(data).to.have.property('your_expected_error_property');
      }
    };
    ErrorMessage(mockResponse, { your_expected_error_property: 'your_expected_error_value' }, 'your_message');
  });
});

describe('DiagnosticData array', () => {
  it('should have the correct structure for each diagnostic item', () => {
    DiagnosticData.forEach(item => {
      expect(item).to.have.property('image').that.is.a('string');
      expect(item).to.have.property('title').that.is.a('string');
      expect(item).to.have.property('reponses').that.is.an('array');
      expect(item).to.have.property('type').that.is.a('string');
      expect(item).to.have.property('width').that.is.a('string');
      expect(item).to.have.property('rounded').that.is.a('string');
    });
  });

  it('should have valid response options for each diagnostic item', () => {
    DiagnosticData.forEach(item => {
      expect(item.reponses).to.be.an('array').that.is.not.empty;
    });
  });

  it('should have the correct width for each diagnostic item', () => {
    DiagnosticData.forEach(item => {
      // Add your width validation logic here based on your expected values
      expect(item.width).to.be.a('string');
    });
  });

  it('should have the correct rounded property for each diagnostic item', () => {
    DiagnosticData.forEach(item => {
      // Add your rounded property validation logic here based on your expected values
      expect(item.rounded).to.be.a('string');
    });
  });
});
