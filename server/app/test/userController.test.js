const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../server.js'); // Replace with the path to your Express app

const { expect } = chai;

chai.use(chaiHttp);

const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userController = require('../controllers/userController.js');

let findOneStub, findByIdStub, saveStub, compareStub, hashStub;
describe('User Controller Tests', () => {

  describe('POST /user/register', () => {
    beforeEach(() => {
      // Set up your mocks and stubs before each test
      saveStub = sinon.stub(User.prototype, 'save').yields(null, { _id: 'mockedUserId' });
      hashStub = sinon.stub(bcrypt, 'hash').yields(null, 'hashedPassword');

    });

    afterEach(() => {
      // Restore the original functions after each test to avoid side effects
      saveStub.restore();
      hashStub.restore();
    });
    it('should register a new user successfully', async () => {
      const res = await chai.request(app)
        .post('/user/register')
        .send({
          password: 'testPassword',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.include('Utilisateur créé');
      expect(res.body).to.have.property('data').to.have.property('_id').to.equal('mockedUserId');
    });

    it('should handle registration failure due to missing fields', async () => {
      const res = await chai.request(app)
        .post('/user/register')
        .send({
          // Missing required fields
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Mot de passe est vide');
    });
  });
  

  describe('POST /user/login', () => {
    beforeEach(()=>{
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

    })
    afterEach(()=>{
      findOneStub.restore();
      compareStub.restore()
    })
    it('should log in a user successfully', async () => {
      const res = await chai.request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.include('Utilisateur connecté');
      expect(res.body).to.have.property('user').to.have.property('_id').to.equal('mockedUserId');
      expect(res.body).to.have.property('user').to.have.property('connected').to.equal(true);
    });
  })
  describe('POST /user/login', () => {
    beforeEach(()=>{
      findOneStub = sinon.stub(User, 'findOne').yields('Login error');

    })
    afterEach(()=>{
      findOneStub.restore();
    })
    it('should handle login failure due to user not found', async () => {
      // Mock User.findOne for login failure

      const res = await chai.request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword',
        });

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message').to.equal('Utilisateur non trouvé');
    });
  });

  describe('POST /user/login', () => {

    beforeEach(()=>{
      findOneStub = sinon.stub(User, 'findOne').yields(null, {
        _id: 'mockedUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        connected: false,
      });
      compareStub = sinon.stub(bcrypt, 'compare').callsFake((plainPassword, hashedPassword, callback) => {
        // Simulate an error
        const error = new Error("Mot de passe incorrect");
        callback(error);
      });
    })
    afterEach(()=>{
      findOneStub.restore();
      compareStub.restore();
    })
  
    it('should handle login failure due to incorrect password', async () => {
      const res = await chai.request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'incorrectPassword',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Mot de passe incorrect');
    });
  });

  describe('POST /logout', () => {
    beforeEach(()=>{
      findByIdStub = sinon.stub(User, 'findById').yields(null, {
        _id: 'mockedUserId',
        connected: true,
        save: sinon.stub().yields(null, {
          _id: 'mockedUserId',
          connected: false,
        }),
      });
    })
    afterEach(()=>{
      saveStub.restore();
      findByIdStub.restore();
    })
    it('should log out a user successfully', async () => {


      const res = await chai.request(app)
        .post('/user/logout/mockedUserId'); // Replace with an actual user ID
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.include('Utilisateur déconnecté');
    });
  });

  describe('POST /logout', () => {
    beforeEach(()=>{
      findByIdStub = sinon.stub(User, 'findById').callsFake((userId, callback) => {
        const error = new Error("Utilisateur connecté non trouvé");
        callback(error);
      });
    })
    afterEach(()=>{
      findByIdStub.restore();
    })
    it('should handle logout failure due to user not found', async () => {
      const res = await chai.request(app)
        .post('/user/logout/notmockedUserId'); // Replace with an actual user ID
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Utilisateur connecté non trouvé');
    });
  });
  // describe('GET /users', () => {
  //   it('should get all users successfully', async () => {
  //     // Mock User.find for successful retrieval of users
  //     sinon.stub(User, 'find').yields(null, [
  //       { _id: 'user1', email: 'user1@example.com' },
  //       { _id: 'user2', email: 'user2@example.com' },
  //     ]);

  //     const res = await chai.request(app)
  //       .get('/users');

  //     expect(res).to.have.status(200);
  //     expect(res.body).to.be.an('array').to.have.lengthOf(2);
  //     expect(res.body[0]).to.have.property('_id').to.equal('user1');
  //     expect(res.body[1]).to.have.property('_id').to.equal('user2');
  //   });

  //   it('should handle user retrieval failure', async () => {
  //     // Mock User.find for retrieval failure
  //     sinon.stub(User, 'find').yields('User retrieval error', null);

  //     const res = await chai.request(app)
  //       .get('/users');

  //     expect(res).to.have.status(500);
  //     expect(res.body).to.have.property('message').to.equal('Erreur serveur');
  //   });
  // });

  // describe('GET /users/:userId', () => {
  //   it('should get a user by ID successfully', async () => {
  //     // Mock User.findById for successful retrieval of a user
  //     sinon.stub(User, 'findById').yields(null, { _id: 'mockedUserId', email: 'test@example.com' });

  //     const res = await chai.request(app)
  //       .get('/users/mockUserId'); // Replace with an actual user ID

  //     expect(res).to.have.status(200);
  //     expect(res.body).to.have.property('_id').to.equal('mockedUserId');
  //     expect(res.body).to.have.property('email').to.equal('test@example.com');
  //   });

  //   it('should handle user retrieval failure by ID', async () => {
  //     // Mock User.findById for retrieval failure
  //     sinon.stub(User, 'findById').yields('User retrieval error', null);

  //     const res = await chai.request(app)
  //       .get('/users/nonexistentUserId'); // Replace with a nonexistent user ID

  //     expect(res).to.have.status(401);
  //     expect(res.body).to.have.property('message').to.equal('Utilisateur connecté non trouvé');
  //   });
});
