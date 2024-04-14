const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../server.js'); 
const sinon = require('sinon');
const expect = chai.expect;
const Form = require("../models/formModel");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const fs = require("fs")
chai.use(chaiHttp);

let Mockedform = {
  _id:"mockedFormId",
  selected:[[1,2],[1,2],[2],[1],[3]],
  email:"test@exemple.fr",
  date: new Date()
}
let saveStub, nodemailerStub, fsStub;
describe('Post /form/create', () => {
  let transport = '';
  beforeEach(()=>{
    transport = {
      name: 'testsend',
      version: '1',
      sendMail: function sendMail(data, callback) {
          callback();
      },
      logger: false,
  };
    transport = nodemailer.createTransport(transport);
  })
  afterEach(() => {
    if(saveStub){saveStub.restore();} 
    if(fsStub){fsStub.restore();}
    if(nodemailerStub){nodemailerStub.restore();}
  });
  // it('devrait créer un formulaire', async (done) => {
    
  //   saveStub = sinon.stub(Form.prototype, 'save').yields(null, Mockedform);
  //   nodemailerStub = sinon.stub(transport, 'sendMail').yields(false);
  //   const res = await chai.request(app)
  //     .post('/form/create')
  //     .send(Mockedform)
  //     console.log(res)
  //     expect(res).to.have.status(200);
  //     expect(res.body).to.be.an('object');
    
  // });
  it('should not create a form if save error', async () => {
    
    saveStub = sinon.stub(Form.prototype, 'save').yields(true);
    const res = await chai.request(app)
      .post('/form/create')
      .send(Mockedform)
    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message').to.include('Rêquete invalide');
      
  });
  it('should not create a form if fs error', async () => {
    
    saveStub = sinon.stub(Form.prototype, 'save').yields(false,Mockedform);
    fsStub = sinon.stub(fs, 'writeFileSync').throws(new Error('FS write error'));

    const res = await chai.request(app)
      .post('/form/create')
      .send(Mockedform)
    expect(res).to.have.status(500);
      
  });
  it('should not create a form if fs error', async () => {
    
    saveStub = sinon.stub(Form.prototype, 'save').yields(false,Mockedform);
    fsStub = sinon.stub(fs, 'writeFileSync').throws(new Error('FS write error'));

    const res = await chai.request(app)
      .post('/form/create')
      .send(Mockedform)
    expect(res).to.have.status(500);
      
  });
  // it('devrait obtenir un formulaire par ID', (done) => {
  //   chai
  //     .request(server)
  //     .get('/votre_route_pour_getFormById/FORM_ID') 
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.an('object');
        
  //       done();
  //     });
  // });

  // it('devrait obtenir un formulaire au format PDF par ID', (done) => {
  //   chai
  //     .request(server)
  //     .get('/votre_route_pour_getFormByIdPdf/FORM_ID') 
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.a('string');
        
  //       done();
  //     });
  // });

  // it('devrait obtenir les formulaires par email', (done) => {
  //   chai
  //     .request(server)
  //     .post('/votre_route_pour_getFormsByMail')
  //     .send({
  //       email: 'example@example.com',
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.an('array');
        
  //       done();
  //     });
  // });
});


