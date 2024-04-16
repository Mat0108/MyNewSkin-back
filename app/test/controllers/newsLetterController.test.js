const newsLetterController = require('../../controllers/newsLetterController');
const newsLetter = require("../../models/newsLetterModel");
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaiHttp);

let saveStub;
describe('newsLetterController test', () => {
    afterEach(()=>{
        saveStub.restore()
    })
    it('should save a email to newsletter base', async () => {
        saveStub = sinon.stub(newsLetter.prototype, 'save').yields(null,{email: 'exemple@test.com'});
        const req = {
            body: {
                email: 'exemple@test.com'
            }
        }
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        }
        await newsLetterController.newsLetterRegister(req,res);
        
        const expectedJson = { message: `Utilisateur sauvegardé : exemple@test.com` }
        expect(res.status.calledOnceWithExactly(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
    it('should not save a email to newsletter base if save error', async () => {
        saveStub = sinon.stub(newsLetter.prototype, 'save').yields(true,{});
        const req = {
            body: {
                email: 'exemple@test.com'
            }
        }
        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        }
        await newsLetterController.newsLetterRegister(req,res);
        
        const expectedJson = {message: "Requête invalide"}
        expect(res.status.calledOnceWithExactly(401)).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
    })
});