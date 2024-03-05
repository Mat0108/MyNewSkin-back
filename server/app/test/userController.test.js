const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../server.js'); // Replace with the path to your Express app

const { expect } = chai;

chai.use(chaiHttp);

const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

let findStub, findOneStub, findByIdStub, findOneAndUpdateStub, saveStub, compareStub, hashStub;
describe('User Controller Tests', () => {

  describe('POST /user/register', () => {
    afterEach(() => {
      saveStub.restore();
      hashStub.restore();
    });
    it('should register a new user successfully', async () => {
      saveStub = sinon.stub(User.prototype, 'save').yields(null, { _id: 'mockedUserId' });
      hashStub = sinon.stub(bcrypt, 'hash').yields(null, 'hashedPassword');
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
    it('should handle login failure due to user not found', async () => {
      //Mock User.findOne for login failure
      findOneStub = sinon.stub(User, 'findOne').yields('Login error');

      const res = await chai.request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword',
        });

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message').to.equal('Utilisateur non trouvé');
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
      const res = await chai.request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'incorrectPassword',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Mot de passe incorrect');
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
        save: sinon.stub().yields(null, {
          _id: 'mockedUserId',
          connected: false,
        }),
      });
      const res = await chai.request(app)
        .post('/user/logout/mockedUserId'); // Replace with an actual user ID
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.include('Utilisateur déconnecté');
    });
    it('should handle logout failure due to user not found', async () => {
      findByIdStub = sinon.stub(User, 'findById').callsFake((userId, callback) => {
        const error = new Error("Utilisateur connecté non trouvé");
        callback(error);
      });
      const res = await chai.request(app)
        .post('/user/logout/notmockedUserId'); // Replace with an actual user ID
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Utilisateur connecté non trouvé');
    });
  });

  describe('GET /users', () => {
    beforeEach(()=>{
      if(findStub){findStub.restore()}
    })
    it('should get all users successfully', async () => {
      // Mock User.find for successful retrieval of users
       findStub = sinon.stub(User, 'find').returns({
        exec: sinon.stub().yields(null, [
          { _id: 'user1', email: 'user1@example.com' },
          { _id: 'user2', email: 'user2@example.com' },
        ]) // Replace `mockUsers` with your array of user objects
      });

      const res = await chai.request(app)
        .get('/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').to.have.lengthOf(2);
      expect(res.body[0]).to.have.property('_id').to.equal('user1');
      expect(res.body[1]).to.have.property('_id').to.equal('user2');
    });

    it('should handle user retrieval failure', async () => {
      // Mock User.find for retrieval failure
      findStub = sinon.stub(User, 'find').returns({
        // Stub the exec method to yield an error
        exec: sinon.stub().yields(new Error("Erreur serveur"), null) // Simulating an error scenario
      });
      const res = await chai.request(app)
        .get('/users');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message').to.equal('Erreur serveur');
    });
  });


  describe('GET /users/:userId', () => {
    afterEach(()=> {
      findByIdStub.restore();
    })
    it('should get a user by ID successfully', async () => {
      // Mock User.findById for successful retrieval of a user

        findByIdStub = sinon.stub(User, 'findById').returns({
          exec: sinon.stub().yields(null, {_id:"mockedUserId",email:"test@example.com"}) // Replace `mockUser` with your mock user object
        });
      const res = await chai.request(app)
        .get('/user/mockedUserId'); 
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id').to.equal('mockedUserId');
      expect(res.body).to.have.property('email').to.equal('test@example.com');
    });

    it('should handle user retrieval failure by ID', async () => {
      // Mock User.findById for retrieval failure
      findByIdStub = sinon.stub(User, 'findById').returns({
        exec: sinon.stub().callsFake((callback) => {
          //Simulate an error
          const error = new Error("Utilisateur connecté non trouvé");
          callback(error);
        })
      });
      const res = await chai.request(app)
        .get('/user/nonexistentUserId'); // Replace with a nonexistent user ID

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').to.equal('Utilisateur connecté non trouvé');
    });
});

describe('PUT /users/:userId', () => {
  afterEach(()=> {
    if(findOneAndUpdateStub){findOneAndUpdateStub.restore();}
  })
  it('should put a user by ID successfully', async () => {

    // Mock User.findById for successful retrieval of a user

      findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').resolves({ _id: 'mockedUserId', email:'test@example.com' });

    const res = await chai.request(app)
      .put('/user/mockedUserId') 
      .send({email:'text@exemple.com'})
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('user').to.have.property('_id').to.equal('mockedUserId');
    expect(res.body).to.have.property('user').to.have.property('email').to.equal('test@example.com');
  });
  // it('shound not put if user not found',async ()=>{
  //   findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').returns({
  //     exec: sinon.stub().callsFake((callback) => {
  //       //Simulate an error
  //       const error = new Error("Utilisateur connecté non trouvé");
  //       callback(error);
  //     })
  //   });
    
  //   const res = await chai.request(app)
  //   .put('/user/notmockedUserId') 
  //   .send({email:'text@exemple.com'})

  //   console.log(res)
  // expect(res).to.have.status(500);
  // expect(res.body).to.have.property('message').to.equal('Utilisateur non trouvé');
  // })
  
});
});


