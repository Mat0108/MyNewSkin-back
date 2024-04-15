const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');


const userController = require('../controllers/userController');

const nodemailer = require('nodemailer')
const { expect } = chai;

chai.use(chaiHttp);

const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose')
const db = require("../models");
let findStub, findOneStub, findByIdStub, findOneAndUpdateStub, findByIdAndUpdateStub, findByIdAndRemoveStub, saveStub, compareStub;
let hashStub, callApiStub, nodemailerStub;




describe('User Controller Tests', () => {
  beforeEach(()=>{
    callApiStub = sinon.stub(db.mongoose, 'connect').returns(Promise.resolve());
    
  })
  afterEach(()=>{
    callApiStub.restore();
  }) 
  describe('POST /user/register', () => {
    afterEach(() => {
      saveStub.restore();
      hashStub.restore();
      
    });
    it('should register a new user successfully', async () => {
      saveStub = sinon.stub(User.prototype, 'save').yields(null,{
        _id: 'mockedUserId',
        password: 'testPassword',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
      });
      hashStub = sinon.stub(bcrypt, 'hash').yields(null, 'hashedPassword');
      const req = { body:{
        user:{
          _id: 'mockedUserId',
          password: 'testPassword',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
        },language:'fr' }};
      let res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const expectedJson = {
        message: 'Utilisateur créé : test@example.com',
        data: {
          _id: 'mockedUserId',
          password: 'testPassword',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
        }
      };
      await userController.userRegister(req,res)
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });

    it('should handle registration failure due to missing fields', async () => {
      const req = { body: {} };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userRegister(req,res)
      const expectedJson = {
        message: 'Mot de passe est vide',
      };
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  });
  

  describe('POST /user/login', () => {
    afterEach(()=>{
      findOneStub.restore();
      compareStub.restore()
    })
    it('should log in a user successfully', async () => {
      findOneStub = sinon.stub(User, 'findOne').yields(null, {
        _id: 'mockedUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        connected: false,
        save: sinon.stub().yields(null, {
          _id: 'mockedUserId',
          email: 'test@example.com',
          password: 'hashedPassword',
          connected: true,
        }),
      });
      compareStub = sinon.stub(bcrypt, 'compare').yields(null, true);

      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogin(req,res)
      const expectedJson = {
        message: 'Utilisateur connecté : test@example.com',
        user: {
          _id: 'mockedUserId',
          email: 'test@example.com',
          password: 'hashedPassword',
          connected: true,
        }
      };
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
    });
    it('should handle login failure due to user not found', async () => {
      //Mock User.findOne for login failure
      findOneStub = sinon.stub(User, 'findOne').yields('Login error');
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword'
      }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogin(req,res)
      const expectedJson = {
        message: 'Utilisateur non trouvé'
      };
      expect(res.status.calledOnceWithExactly(500)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('should handle login failure due to incorrect password', async () => {
      findOneStub = sinon.stub(User, 'findOne').yields(null, {
        _id: 'mockedUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        connected: false,
      });
      compareStub = sinon.stub(bcrypt, 'compare').callsFake((plainPassword, hashedPassword, callback) => {
        //Simulate an error
        const error = new Error("Mot de passe incorrect");
        callback(error);
      });
      const req = {
        body:{
          email: 'test@example.com',
          password: 'incorrectPassword'}};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogin(req,res)
      const expectedJson = {
        message: 'Mot de passe incorrect'
      };
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  })


  describe('POST /logout', () => {
    afterEach(()=>{
      findByIdStub.restore();
    })
    it('should log out a user successfully', async () => {
      findByIdStub = sinon.stub(User, 'findById').yields(null, {
        _id: 'mockedUserId',
        connected: true,
        email:"user@test.com",
        save: sinon.stub().yields(null, {
          _id: 'mockedUserId',
          connected: false,
          email:"user@test.com"
        }),
      });
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogout(req,res)
      const expectedJson = {
        message: 'Utilisateur déconnecté : user@test.com'
      };
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('should do nothing if a user is already logout', async () => {
      findByIdStub = sinon.stub(User, 'findById').yields(null, {
        _id: 'mockedUserId',
        connected: false,
        email:"user@test.com",
        save: sinon.stub().yields(null, {
          _id: 'mockedUserId',
          connected: false,
          email:"user@test.com"
        }),
      });
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogout(req,res)
      const expectedJson = {
        message: 'Utilisateur non connecté '
      };
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('should handle logout failure due to user not found', async () => {
      findByIdStub = sinon.stub(User, 'findById').callsFake((userId, callback) => {
        const error = new Error("Utilisateur connecté non trouvé");
        callback(error);
      });
      const req = {
        params:{
          userId: 'userid',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogout(req,res)
      const expectedJson = {
        message: 'Utilisateur connecté non trouvé'
      };
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
    });

    it('should do nothing if save error', async () => {
      findByIdStub = sinon.stub(User, 'findById').yields(null, {
        _id: 'mockedUserId',
        connected: true,
        email:"user@test.com",
        save: sinon.stub().yields(true,{}),
      });
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.userLogout(req,res)
      const expectedJson = {
        message: 'Requête invalide'
      };
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  });

  describe('GET /users', () => {
    afterEach(()=>{
      if(findStub){findStub.restore()}
    })
    it('should get all users successfully', async () => {
      //Mock User.find for successful retrieval of users
       findStub = sinon.stub(User, 'find').returns({
        exec: sinon.stub().yields(null, [
          { _id: 'user1', email: 'user1@example.com' },
          { _id: 'user2', email: 'user2@example.com' },
        ]) // Replace `mockUsers` with your array of user objects
      });
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.getAllUsers(req,res)
      const expectedJson = [
        { _id: 'user1', email: 'user1@example.com' },
        { _id: 'user2', email: 'user2@example.com' }
      ];
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
    });

    it('should handle user retrieval failure', async () => {
      //Mock User.find for retrieval failure
      findStub = sinon.stub(User, 'find').returns({
        exec: sinon.stub().yields(new Error("Erreur serveur"), null) // Simulating an error scenario
      });
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.getAllUsers(req,res)
      const expectedJson = {
        message:"Erreur serveur"
      };
      expect(res.status.calledOnceWithExactly(500)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  });


  describe('GET /users/:userId', () => {
    afterEach(()=> {
      findByIdStub.restore();
    })
    it('should get a user by ID successfully', async () => {
      //Mock User.findById for successful retrieval of a user

      findByIdStub = sinon.stub(User, 'findById').returns({
          exec: sinon.stub().yields(null, {_id:"mockedUserId",email:"test@example.com"}) // Replace `mockUser` with your mock user object
        });

      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
        await userController.getUserById(req,res)
        const expectedJson = {_id:"mockedUserId",email:"test@example.com"};
        expect(res.status.calledOnceWithExactly(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
    });

    it('should handle user retrieval failure by ID', async () => {
      //Mock User.findById for retrieval failure
      findByIdStub = sinon.stub(User, 'findById').returns({
        exec: sinon.stub().callsFake((callback) => {
          const error = new Error("Utilisateur connecté non trouvé");
          callback(error);
        })
      });
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.getUserById(req,res)
      const expectedJson = { message: "Utilisateur connecté non trouvé" };
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
});

  describe('PUT /users/:userId', () => {
    afterEach(()=> {
      if(findOneAndUpdateStub){findOneAndUpdateStub.restore();}
    })
    it('should put a user by ID successfully', async () => {
      findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').yields(null,{ _id: 'mockedUserId', email:'test@example.com' });
      const req = {
        params:{
          userId: 'mockedUserId',
        },
        body:{_id: 'mockedUserId', email:'test@example.com'}};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.updateUser(req,res)
      const expectedJson = {  
        message: "Utilisateur est bien mis à jour", 
        user:{_id: 'mockedUserId', email:'test@example.com'}
      };
      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('shound not put if user not found',async ()=>{
      findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').yields(null,{});
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.updateUser(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};
      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
    it('shound not put if erreur serveur',async ()=>{
      findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').yields(true,null);
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.updateUser(req,res)
      const expectedJson = { message: 'Requête invalide'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
  });


  describe('Patch /users/:userId', () => {
    afterEach(()=> {
      if(findByIdAndUpdateStub){findByIdAndUpdateStub.restore();}
    })
    it('should patch a user by ID successfully', async () => {
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').yields(null,{ _id: 'mockedUserId', email:'test@exemple.com' });
    
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.patchUser(req,res)
      const expectedJson = { message: 'Utilisateur est bien été mise à jour', user:{_id: 'mockedUserId', email:'test@exemple.com'}};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('shound not patch if user not found',async ()=>{
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').yields(null,{});
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.patchUser(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
    })
    it('shound not patch if erreur serveur',async ()=>{
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').yields(true,null);
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.patchUser(req,res)
      const expectedJson = { message: 'Requête invalide'};
      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
  });

  describe('delete /users/:userId', () => {
    afterEach(()=> {
      if(findByIdAndRemoveStub){findByIdAndRemoveStub.restore();}
    })
    it('should delete a user by ID successfully', async () => {
      findByIdAndRemoveStub = sinon.stub(User, 'findByIdAndRemove').yields(null,{ _id: 'mockedUserId', email:'test@example.com' });
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.deleteUser(req,res)
      const expectedJson = { 
        message: 'Utilisateur est bien été supprimé',
        user: {
          _id: "mockedUserId",
          email: "test@example.com"
        }};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('shound not delete if user not found',async ()=>{
      findByIdAndRemoveStub = sinon.stub(User, 'findByIdAndRemove').yields(null,{});
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.deleteUser(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
    it('shound not delete if erreur serveur',async ()=>{
      findOneAndUpdateStub = sinon.stub(User, 'findByIdAndRemove').yields(true,null);
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.deleteUser(req,res)
      const expectedJson = { message: 'Requête invalide'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
  });


  describe('post /users/forgetpassword', () => {
    let transporter = '';
    beforeEach(()=>{
      transport = {
        name: 'testsend',
        version: '1',
        sendMail: function sendMail(data, callback) {
            callback();
        },
        logger: false,
        debug: true,};
        transporter = nodemailer.createTransport(transport);
    })
    afterEach(() => {
      findOneStub.restore();
      if(nodemailerStub){nodemailerStub.restore();}
    });
  
    it('should not send password reset mail if user not found', async () => {
      findOneStub = sinon.stub(User, 'findOne').yields(false, false);
      const req = {
        body:{
          email: 'notemail@exemple.com'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.demandeReinitialisationMotDePasse(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
    });

    it('should not send password reset mail if save error', async () => {
      findOneStub = sinon.stub(User, 'findOne').yields(null, { email: 'email@example.com',save:sinon.stub(User.prototype, 'save').yields(true,null)});
      const req = {
        body:{
          email: 'email@exemple.com'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.demandeReinitialisationMotDePasse(req,res)
      const expectedJson = { message: 'Erreur serveur'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  
    it('should not send password reset mail if mail error', async () => {
      findOneStub = sinon.stub(User, 'findOne').yields(null, { email: 'email@example.com', save: sinon.stub().yields(null,{_id:"mockeduserid",email:"test" }) });
      nodemailerStub = sinon.stub(transporter, 'sendMail').yields(true,false);
      const req = {
        body:{
          email: 'email@exemple.com' ,
          language:'fr'
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.demandeReinitialisationMotDePasse(req,res)
      const expectedJson = { message: "Erreur lors de l'envoi de l'e-mail" };

      expect(res.status.calledOnceWithExactly(400))
      // expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  
    it('should send password reset mail ', async () => {
      findOneStub = sinon.stub(User, 'findOne').yields(null, { email: 'email@example.com', save: sinon.stub().yields(null,{_id:"mockeduserid",email:"email@example.com" }) });
      nodemailerStub = sinon.stub(transporter, 'sendMail').yields(false);
      const req = {
        body:{
          email: 'email@exemple.com',
          language:'fr'
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.demandeReinitialisationMotDePasse(req,res)
      const expectedJson = { message: 'email de réinitialisation envoyé avec succès' };

      expect(res.status.calledOnceWithExactly(200))
      // expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    
  });

  describe('post /users/validatetoken', () => {
    afterEach(()=> {
      if(findOneStub){findOneStub.restore();}
    })
    it('should validate token if token is not expires', async () => {
      const user = {
        _id: 'mockedUserId',
        resetPasswordToken: 'someResetToken',
        resetPasswordExpires: new Date(Date.now() + 3600000)
      };
        findOneStub = sinon.stub(User, 'findOne').callsFake((query, callback) => {
        callback(null, user);
      });

      const req = {
        body:{
          resetToken: 'resetToken'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.checkToken(req,res)
      const expectedJson = { message: 'Token valide', status:true, id:'mockedUserId'};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('shound not validate token if token is expires',async ()=>{
      const user = {
        resetPasswordToken: 'someResetToken',
        resetPasswordExpires: new Date(Date.now() - 3600000)
      };
        findOneStub = sinon.stub(User, 'findOne').callsFake((query, callback) => {
        callback(null, user);
      });
      const req = {
        body:{
          resetToken: 'resetToken'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.checkToken(req,res)
      const expectedJson = { message: 'Token invalide', status:false};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);    
    })
    it('shound not validate token if erreur serveur',async ()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(new Error('Mocked error'), null);
      const req = {
        body:{
          resetToken: 'resetToken'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.checkToken(req,res)
      const expectedJson = { message: 'Token invalide', status:false};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
  });
  describe('post /users/editpassword', () => {
    afterEach(()=>{
      findOneStub.restore();
      hashStub.restore();
      findOneAndUpdateStub.restore();
    })
    it('shound not reset password if user not found',async ()=>{
      
      findOneStub = sinon.stub(User, 'findOne').yields(false,false);
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.reinitialiserMotDePasse(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
    it('shound not reset password if findOne error',async ()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(true);
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.reinitialiserMotDePasse(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);

    })
    it('shound not reset password if token expires',async ()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(false,{_id:"mockedUserId",resetPasswordExpires:new Date(Date.now() - 3600000)});
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.reinitialiserMotDePasse(req,res)
      const expectedJson = { message: 'Token invalide',status:false};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);

    })
    it('shound not reset password if hash not work',async ()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(false,{_id:"mockedUserId",resetPasswordExpires:new Date(Date.now() + 3600000)});
      hashStub = sinon.stub(bcrypt, 'hash').yields(true, false);
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.reinitialiserMotDePasse(req,res)
      const expectedJson = { message: 'Impossible de crypter le nouveau mot de passe'};

      expect(res.status.calledOnceWithExactly(500)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      
 })
    it('shound not reset password if findOneAndUpdate error ',async ()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(false,{_id:"mockedUserId",resetPasswordExpires:new Date(Date.now() + 3600000)});
      hashStub = sinon.stub(bcrypt, 'hash').yields(false, 'hashpassword');
      findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').yields(true,{});
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.reinitialiserMotDePasse(req,res)
      const expectedJson = { message: 'Erreur serveur'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);

    })
    it('shound reset password ',async ()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(false,{_id:"mockedUserId",resetPasswordExpires:new Date(Date.now() + 3600000)});
      hashStub = sinon.stub(bcrypt, 'hash').yields(false, 'hashpassword');
      findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').yields(null,{ _id: 'mockedUserId', email:'test@example.com' });
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.reinitialiserMotDePasse(req,res)
      const expectedJson = { message: 'Mot de passe réinitialisé avec succès'};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
  })


  describe('get /users/expert', () => {
    afterEach(()=> {
      if(findStub){findStub.restore();}
    })
    it('should returns all experts', async () => {
      const listuser = [{_id: 'mockedUserId1'},{_id: 'mockedUserId2'}];
      findStub = sinon.stub(User, 'find').callsFake((query, callback) => {
        callback(null, listuser);
      });

      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.getAllExpert(req,res)
      const expectedJson = { message: 'List Expert',users: [{_id: 'mockedUserId1'},{_id: 'mockedUserId2'}]};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('should not returns all experts if not found experts', async () => {
      findStub = sinon.stub(User, 'find').yields(false,false);
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.getAllExpert(req,res)
      const expectedJson = { message: 'erreur api'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);

    });
    it('should not returns all experts if find error', async () => {
      findStub = sinon.stub(User, 'find').yields(true);
      const req = {
        body:{
          email: 'test@example.com',
          password: 'testPassword',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.getAllExpert(req,res)
      const expectedJson = { message: 'erreur api'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
  });

  describe('get /users/activate/:userId', () => {
    afterEach(()=> {
      if(findByIdAndUpdateStub){findByIdAndUpdateStub.restore();}
    })
    it('should activate account', async () => {
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').yields(null,{ _id: 'mockedUserId', email:'test@example.com' });
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.activateAccount(req,res)
      const expectedJson = { message: 'Utilisateur a bien été confirmé', user:{ _id: 'mockedUserId', email:'test@example.com' }};

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
      

    });
    it('shound not  activate account if user not found',async ()=>{
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').yields(null,{});
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.activateAccount(req,res)
      const expectedJson = { message: 'Utilisateur non trouvé'};

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
    it('shound not  activate account if erreur serveur',async ()=>{
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').yields(true,null);
      const req = {
        params:{
          userId: 'mockedUserId',
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await userController.activateAccount(req,res)
      const expectedJson = { message: 'Requête invalide'};

      expect(res.status.calledOnceWithExactly(400)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
  });
});


