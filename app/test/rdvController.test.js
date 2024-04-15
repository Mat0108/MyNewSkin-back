const chai = require('chai');
const sinon = require('sinon');
const rdvController = require('../controllers/rdvController');
const Rdv = require('../models/rdvModel');
const User = require('../models/userModel');
const { expect } = chai;
let findOne, findById, findByIdAndUpdate, find, saveRdv, deleteOne; 


describe('Rdv Controller', () => {
  describe('createRdv', () => {
    afterEach(() => {
      if(findOne){findOne.restore()}
      if(saveRdv){saveRdv.restore();}
    });

    it('should create a new rendez-vous', async () => {
      findOne = sinon.stub(User, 'findOne').callsFake((query, callback) => callback(null, {}));
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
      findOne =  sinon.stub(User, 'findOne').callsFake((query, callback) => callback('CompteClient not found', null));

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
      findOne = sinon.stub(User, 'findOne').onFirstCall().callsArgWith(1, null, { _id: 'client123', email: 'client@example.com' }).onSecondCall().callsArgWith(1, null, { _id: 'expert456', email: 'expert@example.com' });
      saveRdv = sinon.stub(Rdv.prototype, 'save').callsFake(function(callback) {
          callback(new Error('Save error'), null);
        });
        const req = { body: {} };
        const res = {
          status: sinon.spy(),
          json: sinon.spy(),
    };
});
  
  });

  //Test getAllRdvs function
  describe('getAllRdvs', () => {
    afterEach(() => {
      find.restore();
    })
    it('should get all rendez-vous', async () => {
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      find = sinon.stub(Rdv, 'find').returns({
        populate: sinon.stub().returns({
          populate : sinon.stub().returns({
            exec: sinon.stub().yields(null,{})
          })
        })
     })


      await rdvController.getAllRdvs(req, res);
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
    });

    it('should handle error during retrieval', async () => {
      find = sinon.stub(Rdv, 'find').returns({
        populate: sinon.stub().returns({
          populate : sinon.stub().returns({
            exec: sinon.stub().yields(true,{})
          })
        })
     })
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getAllRdvs(req, res);
      
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Impossible de retourne tous les rdvs'))).to.be.true;

    });
  });

  //Test getRdvById function
  describe('getRdvById', () => {
    afterEach(()=>{
      findById.restore()
    })
    it('should get rendez-vous by ID', async () => {
      findById = sinon.stub(Rdv, 'findById').returns({
        populate: sinon.stub().returns({
          populate : sinon.stub().returns({
            exec: sinon.stub().yields(null,{})
          })
        })
     })
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvById(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;
    });

    it('should handle error during retrieval by ID', async () => {
      findById = sinon.stub(Rdv, 'findById').returns({
        populate: sinon.stub().returns({
          populate : sinon.stub().returns({
            exec: sinon.stub().yields(true,{})
          })
        })
     })
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.getRdvById(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', 'Impossible de supprimer le rdv par son id'))).to.be.true;

    });
  });

   //Test updateRdv function
  describe('updateRdv', () => {
    afterEach(()=>{
      findByIdAndUpdate.restore();
    })
    it('should update rendez-vous by ID', async () => {
      findByIdAndUpdate = sinon.stub(Rdv, 'findByIdAndUpdate').returns({
        populate: sinon.stub().returns({
          populate : sinon.stub().returns({
            exec: sinon.stub().yields(false,{})
          })
        })
     })
      sinon.stub(Rdv, 'populate').callsFake((param) => param);
      const req = { params: { rdvId: 'some_id' }, body: { /* your request body here */ } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.updateRdv(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

    });

    it('should handle error during update by ID', async () => {
      findByIdAndUpdate = sinon.stub(Rdv, 'findByIdAndUpdate').returns({
        populate: sinon.stub().returns({
          populate : sinon.stub().returns({
            exec: sinon.stub().yields(true,null)
          })
        })
      })
      const req = { params: { rdvId: 'some_id' }, body: { /* your request body here */ } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.updateRdv(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnceWith(sinon.match.has('message', "Impossible d'update le rdv"))).to.be.true;

      Rdv.findByIdAndUpdate.restore();
    });
  });

  // Test deleteRdv function
  describe('deleteRdv', () => {
    afterEach(()=>{
      deleteOne.restore();
    })
    it('should delete rendez-vous by ID', async () => {
      deleteOne = sinon.stub(Rdv, 'deleteOne').resolves({rdv:{rdvId:'some_id'}})
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.deleteRdv(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;

    });

    it('should handle deletion error', async () => {
      deleteOne = sinon.stub(Rdv, 'deleteOne').rejects(new Error("Rdv non trouvé"));
      const req = { params: { rdvId: 'some_id' } };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      await rdvController.deleteRdv(req, res).then(()=>{});

      expect(res.status.calledOnceWithExactly(404)).to.be.true;

    });
  });

  // // Test getRdvbyName function
  // describe('getRdvbyName', () => {
  //   it('should get rendez-vous by user name', async () => {
  //     sinon.stub(User, 'find').callsFake((query, callback) => callback(null, {}));
  //     sinon.stub(Rdv, 'find').callsFake((query, callback) => callback(null, {}));
  //     sinon.stub(Rdv, 'populate').callsFake((param) => param);
  //     const req = { body: { Compte: 'some_email' } };
  //     const res = {
  //       status: sinon.spy(),
  //       json: sinon.spy(),
  //     };

  //     await rdvController.getRdvbyName(req, res);

  //     expect(res.status.calledOnceWithExactly(200)).to.be.true;
  //     expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

  //     User.find.restore();
  //     Rdv.find.restore();
  //     Rdv.populate.restore();
  //   });

  //   it('should handle user not found by name', async () => {
  //     sinon.stub(User, 'find').callsFake((query, callback) => callback('User not found by name', null));
  //     const req = { body: { Compte: 'some_email' } };
  //     const res = {
  //       status: sinon.spy(),
  //       json: sinon.spy(),
  //     };

  //     await rdvController.getRdvbyName(req, res);

  //     expect(res.status.calledOnceWithExactly(401)).to.be.true;
  //     expect(res.json.calledOnceWith(sinon.match.has('message', 'User not found by name'))).to.be.true;

  //     User.find.restore();
  //   });

  //   it('should handle retrieval error by name', async () => {
  //     sinon.stub(User, 'find').callsFake((query, callback) => callback(null, {}));
  //     sinon.stub(Rdv, 'find').callsFake((query, callback) => callback('Error during retrieval by name', null));
  //     const req = { body: { Compte: 'some_email' } };
  //     const res = {
  //       status: sinon.spy(),
  //       json: sinon.spy(),
  //     };

  //     await rdvController.getRdvbyName(req, res);

  //     expect(res.status.calledOnceWithExactly(401)).to.be.true;
  //     expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during retrieval by name'))).to.be.true;

  //     User.find.restore();
  //     Rdv.find.restore();
  //   });
  // });

  // // Test getRdvByDate function
  // describe('getRdvByDate', () => {
  //   it('should get rendez-vous by date', async () => {
  //     sinon.stub(Rdv, 'find').callsFake((query, callback) => callback(null, {}));
  //     sinon.stub(Rdv, 'populate').callsFake((param) => param);
  //     const req = { body: { Date: '2023-01-01' } };
  //     const res = {
  //       status: sinon.spy(),
  //       json: sinon.spy(),
  //     };

  //     await rdvController.getRdvByDate(req, res);

  //     expect(res.status.calledOnceWithExactly(200)).to.be.true;
  //     expect(res.json.calledOnceWith(sinon.match.object)).to.be.true;

  //     Rdv.find.restore();
  //     Rdv.populate.restore();
  //   });

  //   it('should handle retrieval error by date', async () => {
  //     sinon.stub(Rdv, 'find').callsFake((query, callback) => callback('Error during retrieval by date', null));
  //     const req = { body: { Date: '2023-01-01' } };
  //     const res = {
  //       status: sinon.spy(),
  //       json: sinon.spy(),
  //     };

  //     await rdvController.getRdvByDate(req, res);

  //     expect(res.status.calledOnceWithExactly(401)).to.be.true;
  //     expect(res.json.calledOnceWith(sinon.match.has('message', 'Error during retrieval by date'))).to.be.true;

  //     Rdv.find.restore();
  //   });
  // });

  // Cleanup after all tests (optional)
  // after(() => {
  //   sinon.restore();
  // });
});
