const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const blogController = require('../controllers/blogController');
const should = chai.should();

const Blog = require("../models/blogModel");
const { expect } = chai;
chai.use(chaiHttp);
let saveStub;
describe('Blog API', () => {
    // Test de la fonction setBlog
    describe('/POST setBlog', () => {
        beforeEach(()=>{
            saveStub = sinon.stub(Blog.prototype, 'save').yields(null, { _id: 'mockedBlogId', title:"test"});
        })
        afterEach(()=>{
            saveStub.restore();
        })
        it('devrait créer un nouvel article de blog', async () => {
            const req = { body: {} };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.setBlog(req,res)

            expect(res.status.calledOnceWithExactly(200)).to.be.true;

    
        });
    });
});
