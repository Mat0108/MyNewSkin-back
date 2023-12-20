const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../yourApp'); // Replace with the path to your Express app

const { expect } = chai;

chai.use(chaiHttp);

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userController = require('../controllers/userController');

describe('User Controller Tests', () => {

  beforeEach(() => {
    // Your setup code (e.g., mock functions or database setup) goes here
  });

  afterEach(() => {
    // Your cleanup code (e.g., restore spies or reset database) goes here
    sinon.restore();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      // Mock the User model and nodemailer for successful registration
      sinon.stub(User.prototype, 'save').yields(null, { _id: 'mockedUserId' });
      sinon.stub(bcrypt, 'hash').yields(null, 'hashedPassword');
      sinon.stub(nodemailer, 'createTransport').returns({
        sendMail: (options, callback) => {
          callback(null, { response: 'mockedResponse' });
        }
      });

      const res = await chai.request(app)
        .post('/register')
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
        .post('/register')
        .send({
          // Missing required fields
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Mot de passe est vide');
    });

    it('should handle registration failure', async () => {
      // Mock the User model for registration failure
      sinon.stub(User.prototype, 'save').yields('Registration error');

      const res = await chai.request(app)
        .post('/register')
        .send({
          password: 'testPassword',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Requête invalide');
    });
  });

  describe('POST /login', () => {
    it('should log in a user successfully', async () => {
      // Mock User.findOne for successful login
      sinon.stub(User, 'findOne').yields(null, {
        _id: 'mockedUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        connected: false,
      });

      // Mock bcrypt.compare for successful password comparison
      sinon.stub(bcrypt, 'compare').yields(null, true);

      // Mock User.save for updating user as connected
      sinon.stub(User.prototype, 'save').yields(null, {
        _id: 'mockedUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        connected: true,
      });

      const res = await chai.request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.include('Utilisateur connecté');
      expect(res.body).to.have.property('user').to.have.property('_id').to.equal('mockedUserId');
      expect(res.body).to.have.property('user').to.have.property('connected').to.equal(true);
    });

    it('should handle login failure due to user not found', async () => {
      // Mock User.findOne for login failure
      sinon.stub(User, 'findOne').yields('Login error');

      const res = await chai.request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword',
        });

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message').to.equal('Utilisateur non trouvé');
    });

    it('should handle login failure due to incorrect password', async () => {
      // Mock User.findOne for successful login
      sinon.stub(User, 'findOne').yields(null, {
        _id: 'mockedUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        connected: false,
      });

      // Mock bcrypt.compare for password comparison failure
      sinon.stub(bcrypt, 'compare').yields(null, false);

      const res = await chai.request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'incorrectPassword',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Mot de passe incorrect');
    });
  });

  describe('POST /logout', () => {
    it('should log out a user successfully', async () => {
      // Mock User.findById for finding the user
      sinon.stub(User, 'findById').yields(null, {
        _id: 'mockedUserId',
        connected: true,
      });

      // Mock User.save for updating user as disconnected
      sinon.stub(User.prototype, 'save').yields(null, {
        _id: 'mockedUserId',
        connected: false,
      });

      const res = await chai.request(app)
        .post('/logout/mockUserId'); // Replace with an actual user ID

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.include('Utilisateur déconnecté');
    });

    it('should handle logout failure due to user not found', async () => {
      // Mock User.findById for not finding the user
      sinon.stub(User, 'findById').yields('User not found', null);

      const res = await chai.request(app)
        .post('/logout/nonexistentUserId'); // Replace with a nonexistent user ID

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Utilisateur connecté non trouvé');
    });
  });

  describe('GET /users', () => {
    it('should get all users successfully', async () => {
      // Mock User.find for successful retrieval of users
      sinon.stub(User, 'find').yields(null, [
        { _id: 'user1', email: 'user1@example.com' },
        { _id: 'user2', email: 'user2@example.com' },
      ]);

      const res = await chai.request(app)
        .get('/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').to.have.lengthOf(2);
      expect(res.body[0]).to.have.property('_id').to.equal('user1');
      expect(res.body[1]).to.have.property('_id').to.equal('user2');
    });

    it('should handle user retrieval failure', async () => {
      // Mock User.find for retrieval failure
      sinon.stub(User, 'find').yields('User retrieval error', null);

      const res = await chai.request(app)
        .get('/users');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message').to.equal('Erreur serveur');
    });
  });

  describe('GET /users/:userId', () => {
    it('should get a user by ID successfully', async () => {
      // Mock User.findById for successful retrieval of a user
      sinon.stub(User, 'findById').yields(null, { _id: 'mockedUserId', email: 'test@example.com' });

      const res = await chai.request(app)
        .get('/users/mockUserId'); // Replace with an actual user ID

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id').to.equal('mockedUserId');
      expect(res.body).to.have.property('email').to.equal('test@example.com');
    });

    it('should handle user retrieval failure by ID', async () => {
      // Mock User.findById for retrieval failure
      sinon.stub(User, 'findById').yields('User retrieval error', null);

      const res = await chai.request(app)
        .get('/users/nonexistentUserId'); // Replace with a nonexistent user ID

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Utilisateur connecté non trouvé');
    });
  });
});
