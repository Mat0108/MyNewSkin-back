const chai = require('chai');
const chaiHttp = require('chai-http');

const sinon = require('sinon');
const expect = chai.expect;
const Form = require("../models/formModel");
const FormController = require("../controllers/formController");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const fs = require("fs")
chai.use(chaiHttp);

let Mockedform = {
  _id:"mockedFormId",
  question1: [1,2],
  question2: [1,2],
  question3: [2],
  question4: [1],
  question5: [3],
  email:"test@exemple.fr",
  date: new Date()
}
let saveStub, nodemailerStub, fsStub,findOneStub, findStub;

describe('User Controller Tests', () => {
  describe('Post /form/create', () => {
    let transporter = '';
    beforeEach(()=>{
      transport = {
        name: 'testsend',
        version: '1',
        sendMail: function sendMail(data, callback) {
            callback();
        },
        logger: false,
    };
    transporter = nodemailer.createTransport(transport);
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
      const req = { body: {} };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await FormController.createForm(req,res)
      const expectedJson = {
        message: 'Rêquete invalide',
      };
      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);      
    });
    it('should not create a form if fs error', async () => {
      
      saveStub = sinon.stub(Form.prototype, 'save').yields(false,Mockedform);
      fsStub = sinon.stub(fs, 'writeFileSync').throws(new Error('FS write error'));

      const req = { body: Mockedform };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      try{
        await FormController.createForm(req,res)
      }catch(error){
        expect(res.message, "Fs write error");
      }
      
    });
    it('should not create a form if mail error', async () => {
      
      saveStub = sinon.stub(Form.prototype, 'save').yields(false,Mockedform);
      fsStub = sinon.stub(fs, 'close');
      nodemailerStub = sinon.stub(transporter, 'sendMail').yields(true,false);
      const req = { body: Mockedform };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await FormController.createForm(req,res)
      const expectedJson = {
        message: 'Impossible de créer le formulaire',
      };
      expect(res.status.calledOnceWithExactly(400))
      // expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);      
        
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
  });

  describe('get /form/get/:formId', () => {
    afterEach(()=> {
      if(findOneStub){findOneStub.restore();}
    })
    it('should return form ', async () => {

      findOneStub = sinon.stub(Form, 'findOne').callsFake((query, callback) => {
        callback(null, Mockedform);
      });

      const req = {
        params:{
          formId: 'formId'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await FormController.getFormById(req,res)
      const expectedJson = Mockedform;

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('shound not return form if error',async ()=>{
      findOneStub = sinon.stub(Form, 'findOne').callsFake((query, callback) => {
        callback(true,{});
      });

      const req = {
        params:{
          formId: 'formId'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await FormController.getFormById(req,res)
      const expectedJson = { message : "Impossible de récuperer le formulaire" };

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })

  })

  describe('get /form/mail/', () => {
    afterEach(()=> {
      if(findStub){findStub.restore();}
    })
    it('should return forms by mail ', async () => {

      findStub = sinon.stub(Form, 'find').callsFake((query, callback) => {
        callback(null, Mockedform);
      });

      const req = {
        body:{
          mail: 'exemple@text.com'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await FormController.getFormsByMail(req,res)
      const expectedJson = Mockedform;

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    });
    it('shound not return form by mail if error',async ()=>{
      findStub = sinon.stub(Form, 'find').callsFake((query, callback) => {
        callback(true,{});
      });

      const req = {
        body:{
          mail: 'exemple@text.com'  
        }};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      await FormController.getFormsByMail(req,res)
      const expectedJson = { message : "Impossible de récuperer le formulaire" };

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })

  })
})
