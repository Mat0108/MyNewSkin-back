const chai = require('chai');
const sinon = require('sinon');
const rdvController = require('../controllers/rdvController');
const Rdv = require('../models/rdvModel');
const User = require('../models/userModel');
const app = require('../../server')
const { expect } = chai;
let find, saveRdv; 


describe('Rdv Controller', () => {
  describe('createRdv', () => {
    afterEach(() => {
      if(find){find.restore()}
      if(saveRdv){saveRdv.restore();}
    });

    it('should create a new rendez-vous', async () => {
      find = sinon.stub(User, 'findOne').callsFake((query, callback) => callback(null, {}));
      saveRdv = sinon.stub(Rdv.prototype, 'save').callsFake((callback) => callback(null, {}));

      const req = { body: {} };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await rdvController.createRdv(req, res);
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Rendez-vous créé'))).to.be.true;
    });

    it('should handle CompteClient not found', async () => {
      findClient =  sinon.stub(User, 'findOne').callsFake((query, callback) => callback('CompteClient not found', null));

      const req = { body: {} };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await rdvController.createRdv(req, res);
      expect(res.status.calledOnceWithExactly(500)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'CompteClient non trouvé'))).to.be.true;
    });

    it('should handle CompteExpert not found', async () => {
      findOne = sinon.stub(User, 'findOne').onFirstCall().callsArgWith(1, null, { _id: 'client123', email: 'client@example.com' })
      .onSecondCall().callsFake((query, callback) => callback('CompteExpert not found', null));
      const req = { body: {} };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await rdvController.createRdv(req, res);
      expect(res.status.calledOnceWithExactly(500)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'CompteExpert non trouvé'))).to.be.true;
    });
    
    it('should handle save error', async () => {
      find = sinon.stub(User, 'findOne').onFirstCall().callsArgWith(1, null, { _id: 'client123', email: 'client@example.com' }).onSecondCall().callsArgWith(1, null, { _id: 'expert456', email: 'expert@example.com' });
      saveRdv = sinon.stub(Rdv.prototype, 'save').callsFake(function(callback) {
          callback(new Error('Save error'), null);
        });
        const req = { body: {} };
        const res = {
          status: sinon.spy(),
          json: sinon.spy(),
  };
  await rdvController.createRdv(req, res);
  console.log(res)
  expect(res.status.calledWith(401)).to.be.true;
  expect(res.json.calledOnce).to.be.true;  
});
  
  });

  //Test getAllRdvs function
  describe('getAllRdvs', () => {
    afterEach(() => {
      find.restore();
    })
    it('should get all rendez-vous', async () => {
      find = sinon.stub(Rdv, 'find').callsFake((callback) => callback(null, {}));
      sinon.stub(Rdv, 'populate').callsFake((param) => param);
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getAllRdvs(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

      Rdv.find.restore();
      Rdv.populate.restore();
    });

    it('should handle error during retrieval', async () => {
      find = sinon.stub(Rdv, 'find').callsFake((query, callback) => callback('Error during retrieval', null));
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getAllRdvs(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during retrieval'))).to.be.true;

      Rdv.find.restore();
    });
  });

  //Test getRdvById function
  describe('getRdvById', () => {
    it('should get rendez-vous by ID', async () => {
      sinon.stub(Rdv, 'findById').callsFake((id, callback) => callback(null, {}));
      sinon.stub(Rdv, 'populate').callsFake((param) => param);
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvById(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

      Rdv.findById.restore();
      Rdv.populate.restore();
    });

    it('should handle error during retrieval by ID', async () => {
      sinon.stub(Rdv, 'findById').callsFake((id, callback) => callback('Error during retrieval by ID', null));
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvById(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during retrieval by ID'))).to.be.true;

      Rdv.findById.restore();
    });
  });

   //Test updateRdv function
  describe('updateRdv', () => {
    it('should update rendez-vous by ID', async () => {
      sinon.stub(Rdv, 'findByIdAndUpdate').callsFake((id, data, options, callback) => callback(null, {}));
      sinon.stub(Rdv, 'populate').callsFake((param) => param);
      const req = { params: { rdvId: 'some_id' }, body: { /* your request body here */ } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.updateRdv(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

      Rdv.findByIdAndUpdate.restore();
      Rdv.populate.restore();
    });

    it('should handle error during update by ID', async () => {
      sinon.stub(Rdv, 'findByIdAndUpdate').callsFake((id, data, options, callback) => callback('Error during update by ID', null));
      const req = { params: { rdvId: 'some_id' }, body: { /* your request body here */ } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.updateRdv(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during update by ID'))).to.be.true;

      Rdv.findByIdAndUpdate.restore();
    });
  });

  // Test deleteRdv function
  describe('deleteRdv', () => {
    it('should delete rendez-vous by ID', async () => {
      sinon.stub(Rdv, 'deleteOne').callsFake((query, callback) => callback(null, {}));
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.deleteRdv(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Rdv est bien supprimé'))).to.be.true;

      Rdv.deleteOne.restore();
    });

    it('should handle deletion error', async () => {
      sinon.stub(Rdv, 'deleteOne').callsFake((query, callback) => callback('Deletion error', null));
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.deleteRdv(req, res);

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Rdv non trouvé'))).to.be.true;

      Rdv.deleteOne.restore();
    });
  });

  // Test getRdvbyName function
  describe('getRdvbyName', () => {
    it('should get rendez-vous by user name', async () => {
      sinon.stub(User, 'find').callsFake((query, callback) => callback(null, {}));
      sinon.stub(Rdv, 'find').callsFake((query, callback) => callback(null, {}));
      sinon.stub(Rdv, 'populate').callsFake((param) => param);
      const req = { body: { Compte: 'some_email' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvbyName(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

      User.find.restore();
      Rdv.find.restore();
      Rdv.populate.restore();
    });

    it('should handle user not found by name', async () => {
      sinon.stub(User, 'find').callsFake((query, callback) => callback('User not found by name', null));
      const req = { body: { Compte: 'some_email' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvbyName(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'User not found by name'))).to.be.true;

      User.find.restore();
    });

    it('should handle retrieval error by name', async () => {
      sinon.stub(User, 'find').callsFake((query, callback) => callback(null, {}));
      sinon.stub(Rdv, 'find').callsFake((query, callback) => callback('Error during retrieval by name', null));
      const req = { body: { Compte: 'some_email' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvbyName(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during retrieval by name'))).to.be.true;

      User.find.restore();
      Rdv.find.restore();
    });
  });

  // Test getRdvByDate function
  describe('getRdvByDate', () => {
    it('should get rendez-vous by date', async () => {
      sinon.stub(Rdv, 'find').callsFake((query, callback) => callback(null, {}));
      sinon.stub(Rdv, 'populate').callsFake((param) => param);
      const req = { body: { Date: '2023-01-01' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvByDate(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

      Rdv.find.restore();
      Rdv.populate.restore();
    });

    it('should handle retrieval error by date', async () => {
      sinon.stub(Rdv, 'find').callsFake((query, callback) => callback('Error during retrieval by date', null));
      const req = { body: { Date: '2023-01-01' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvByDate(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during retrieval by date'))).to.be.true;

      Rdv.find.restore();
    });
  });

  // Cleanup after all tests (optional)
  // after(() => {
  //   sinon.restore();
  // });
});
