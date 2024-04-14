
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon')
const app = require('../../server.js');
const mongoose = require('mongoose')
const db = require("../models");
const expect = chai.expect;
const passport = require('passport');
require('dotenv').config();

chai.use(chaiHttp);
let callApiStub, passportStub;
describe('App', () => {
  beforeEach(()=>{
    callApiStub = sinon.stub(db.mongoose, 'connect').returns(Promise.resolve());
    
  })
  afterEach(()=>{
    callApiStub.restore();
  }) 
  it('should return welcome message on / GET', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Bienvenue sur l\'application Po. Version : 1.9.0');
        done();
      });
  });

  it('should return 404 on undefined routes', (done) => {
    chai.request(app)
      .get('/nonexistentroute')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
    describe('Authentication', () => {
      afterEach(()=>{
        passportStub.restore();
      })
      // it('should to /protected with valid session', (done) => {
        
      //   passportStub = sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {            
      //     callback(null, { "username": "test@techbrij.com"}, null);             
      //     return (req,res,next)=>{};
      //  });

      //   chai.request(app)
      //     .post('/login')
      //     .send({ email: process.env.TEST_USER, password: process.env.TEST_PASS })
      //     .redirects(0)
      //     .end((err, res, body) => {
      //       expect(res).to.have.property('text').to.equal('Found. Redirecting to /protected');
      //       done();
      //     });
      // });
    
      it('should to /user/login without valid session', (done) => {
        
        passportStub = sinon.stub(passport, 'authenticate').callsFake((strategy, options) => {
          return function(req, res, next) {
            return next(); 
          };
        });
        chai.request(app)
          .post('/login')
          .send({ email: process.env.TEST_USER, password: process.env.TEST_PASS })
          .redirects(0)
          .end((err, res, body) => {
            expect(res).to.have.property('text').to.equal('Found. Redirecting to /user/login');
            done();
          });
      });
    });
  describe('Stripe Integration', () => {
    it('should return 200 on creating checkout session', (done) => {
      chai.request(app)
        .post('/create-checkout-session')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

});


