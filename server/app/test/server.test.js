
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('App', () => {
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
    it('should return 302 on successful login', (done) => {
      chai.request(app)
        .post('/login')
        .send({ username: 'utilisateur', password: 'motdepasse' })
        .end((err, res) => {
          expect(res).to.have.status(302); // Redirection après une connexion réussie
          done();
        });
    });

    it('should return 200 on accessing protected route with valid session', (done) => {
      // Supposons que /protected est une route protégée nécessitant une connexion
      chai.request(app)
        .get('/protected')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should return 302 on accessing protected route without valid session', (done) => {
      chai.request(app)
        .get('/protected')
        .end((err, res) => {
          expect(res).to.have.status(302); // Redirection vers /login sans authentification
          done();
        });
    });
  });

  describe('Stripe Integration', () => {
    it('should return 303 on creating checkout session', (done) => {
      chai.request(app)
        .post('/create-checkout-session')
        .end((err, res) => {
          expect(res).to.have.status(303);
          done();
        });
    });
  });
});
