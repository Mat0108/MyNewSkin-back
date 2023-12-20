const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../controllers/blogController.js');
const should = chai.should();

chai.use(chaiHttp);

describe('Blog API', () => {
    // Test de la fonction setBlog
    describe('/POST setBlog', () => {
        it('devrait créer un nouvel article de blog', (done) => {
            const newBlog = {
                // les propriétés du blog comme dans votre exemple
            };

            chai.request(app)
                .post('/blog/set')
                .send(newBlog)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    
                    done();
                });
        });
    });
});
