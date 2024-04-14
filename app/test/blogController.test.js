const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../server.js'); 
const should = chai.should();

const Blog = require("../models/blogModel");
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
        it('devrait créer un nouvel article de blog', (done) => {
            const newBlog = {
                // les propriétés du blog comme dans votre exemple
            };

            chai.request(app)
                .post('/blog/set')
                .send(newBlog)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('title');
                    
                    done();
                });
        });
    });
});
