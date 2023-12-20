const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../chemin/vers/votre/fichier/contenant/les/routes'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Tests unitaires pour les routes', () => {
  it('devrait créer un formulaire', (done) => {
    chai
      .request(server)
      .post('/votre_route_pour_createForm')
      .send({
        nom: 'John Doe',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
         
        done();
      });
  });

  it('devrait obtenir un formulaire par ID', (done) => {
    chai
      .request(server)
      .get('/votre_route_pour_getFormById/FORM_ID') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        
        done();
      });
  });

  it('devrait obtenir un formulaire au format PDF par ID', (done) => {
    chai
      .request(server)
      .get('/votre_route_pour_getFormByIdPdf/FORM_ID') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('string');
        
        done();
      });
  });

  it('devrait obtenir les formulaires par email', (done) => {
    chai
      .request(server)
      .post('/votre_route_pour_getFormsByMail')
      .send({
        email: 'example@example.com',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        
        done();
      });
  });
});
