const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const blogController = require('../../controllers/blogController');
const should = chai.should();

const Blog = require("../../models/blogModel");
const { expect } = chai;
chai.use(chaiHttp);
let saveStub, findByIdStub, findStub, deleteOneStub;
let MockedBlog = {
    title:"Les 10 étapes d'une routine de soin pour une peau parfaite",
    imagepresentation:"/images/Blog/peauparfaite/peauparfaite.png",
    altimagepresentation:"peauparfaite",
    textpresentation:"Prendre soin de sa peau est un acte d'amour envers soi-même. Une routine de soin de la peau bien établie peut vous aider à maintenir une peau saine, lumineuse et belle. Pour qu’une routine visage soit efficace, il y a quelques règles et étapes à respecter. Des étapes que l’on oublie, que l’on néglige, ou simplement que l’on ne connaît pas parfois. On vous dévoile ici les différentes étapes pour avoir une peau saine et éclatante !",
    titlelist:"Les 10 étapes d'une routine de soin pour une peau parfaite#%1. Le démaquillage#%2. Le nettoyage#%3. L'exfoliation#%4. Le tonique#%5. Le sérum#%6. L'hydratation#%null#%7. Le contour des yeux#%8. La protection solaire#%9. Les soins ciblés#%10. Le repos #%null",
    textlist:"Prendre soin de sa peau est un acte d'amour envers soi-même. Une routine de soin de la peau bien établie peut vous aider à maintenir une peau saine, lumineuse et belle. Pour qu’une routine visage soit efficace, il y a quelques règles et étapes à respecter. Des étapes que l’on oublie, que l’on néglige, ou simplement que l’on ne connaît pas parfois. On vous dévoile ici les différentes étapes pour avoir une peau saine et éclatante !#%Si vous portez du maquillage, retirez-le soigneusement à l'aide d'un démaquillant doux. Assurez-vous de ne laisser aucune trace de maquillage.#%La première étape consiste à nettoyer votre visage matin et soir. Choisissez un nettoyant adapté à votre type de peau pour éliminer les impuretés, le reste de maquillage et l'excès de sébum.#%Exfoliez votre peau une à deux fois par semaine pour éliminer les cellules mortes et favoriser le renouvellement cellulaire. Utilisez un gommage ou un exfoliant chimique selon vos préférences.#%Appliquez un tonique pour rééquilibrer le pH de votre peau et préparer votre épiderme à absorber les produits qui suivront.#%Les sérums sont des produits concentrés en actifs. Choisissez un sérum adapté à vos besoins spécifiques, qu'il s'agisse d'hydratation, d'anti-âge, de pigmentation, ou autre.#%Hydratez votre peau avec une crème adaptée à votre type de peau. L'hydratation est cruciale pour maintenir une barrière cutanée saine et pour éviter la sensation de tiraillement ou de fini gras.#%null#%Appliquez une crème spécifique pour le contour des yeux pour hydrater cette zone délicate et prévenir les ridules. Faites attention aux composants des produits que vous mettez autour des yeux. Prenez l’avis des spécialistes.#%Même les jours nuageux, protégez votre peau des rayons UV en utilisant un écran solaire avec un SPF approprié. C'est l'un des moyens les plus efficaces pour prévenir le vieillissement prématuré et les problèmes de pigmentation.#%Si vous avez des problèmes de peau spécifiques, comme l'acné ou la rosacée, appliquez les traitements adaptés après le sérum, mais avant l'hydratant.#%Enfin, ne sous-estimez pas l'importance du sommeil. Une nuit de repos réparateur contribue grandement à la régénération de la peau et lui donne un aspect plus reposant et éclatant.#%N'oubliez pas que la constance est la clé de l’efficacité d'une skincare routine. Donnez à votre peau le temps de s'adapter aux nouveaux produits que vous introduisez dans votre routine, et soyez patient(e). En suivant ces 10 étapes, vous pouvez prendre soin de votre peau de manière complète et efficace, pour un teint éclatant et une peau en pleine santé.",
    imagelist:"/images/Blog/peauparfaite/peauparfaite.png#%null#%null#%null#%null#%null#%null#%/images/Blog/peauparfaite/peauparfaite2.png#%null#%null#%null#%null#%null",
    altimage:"peauparfaite#%null#%null#%null#%null#%null#%null#%peauparfaite2#%null#%null#%null#%null#%null",
    textcolor:"text-black#%null#%null#%null#%null#%null#%null#%null#%null#%null#%null#%null#%null",
    layout:"IFTD#%TF#%TF#%TF#%TF#%TF#%TF#%IF#%TF#%TF#%TF#%TF#%TF"
}
describe('Blog Controller test', () => {
    // Test de la fonction setBlog
    describe('POST setBlog', () => {
        afterEach(()=>{
            saveStub.restore();
        })
        it('devrait crée un nouvel article de blog', async () => {
            saveStub = sinon.stub(Blog.prototype, 'save').yields(null, MockedBlog);
            const req = { body: MockedBlog };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.setBlog(req,res)
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly({message:"Le blog a bien été crée",blog:MockedBlog})).to.be.true;
        });
        it('devrait pas crée un nouvel article de blog si save error', async () => {
            saveStub = sinon.stub(Blog.prototype, 'save').yields(true, MockedBlog);
            const req = { body: MockedBlog };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.setBlog(req,res)
            const expectedJson = {
                message: 'Impossible de créer un blog'
              };
            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
    });
    describe('GET /get/id/:blogId/', () => {
        afterEach(()=>{
            findByIdStub.restore();
        })
        it('devrait retournée un blog par son id', async () => {
            findByIdStub = sinon.stub(Blog, 'findById').yields(null, MockedBlog);
            const req = { params: 'MockedIdForm' };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getBlog(req,res)
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly({message:"Retourne le blog",blog:MockedBlog})).to.be.true;
        });
        it('devrait pas retourné un blog par son id si find error', async () => {
            findByIdStub = sinon.stub(Blog, 'findById').yields(true, MockedBlog);
            const req = { params: 'MockedIdForm' };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getBlog(req,res)
            const expectedJson = {
                message: 'Impossible de récuperer le blog'
              };
            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
    });
    describe('GET /blog/', () => {
        afterEach(()=>{
            findStub.restore();
        })
        it('devrait retournée tous les blogs', async () => {
            findStub = sinon.stub(Blog, 'find').yields(null, MockedBlog);
            const req = { };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getAllBlog(req,res)
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly(MockedBlog)).to.be.true;
        });
        it('devrait pas retournée tous les blogs si find error', async () => {
            findStub = sinon.stub(Blog, 'find').yields(true, MockedBlog);
            const req = { params: 'MockedIdForm' };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getAllBlog(req,res)
            const expectedJson = {
                message: 'Impossible de récuperer les blogs'
              };
            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
    });
    describe('GET blog/get/alt/:altId', () => {
        afterEach(()=>{
            findStub.restore();
        })
        it('devrait retournée tous le blog par son titre', async () => {
            findStub = sinon.stub(Blog, 'find').yields(null, MockedBlog);
            const req = { params: {altId:'MockedTitle'}};
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getBlogByField(req,res)
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly(MockedBlog)).to.be.true;
        });
        it('devrait pas retournée tous le blog par son titre si find error', async () => {
            findStub = sinon.stub(Blog, 'find').yields(true, {});
            const req = { params: {altId:'MockedTitle'}};
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getBlogByField(req,res)
            const expectedJson = {
                message: 'Impossible de récuperer le blog'
              };
            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
    });
    
    describe('GET /blog/get/search/:searchId', () => {
        afterEach(()=>{
            findStub.restore();
        })
        it('devrait retournée tous le blog par son titre', async () => {
            findStub = sinon.stub(Blog, 'find').yields(null, MockedBlog);
            const req = { params: {searchId:'MockedTitle'}};
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getBlogByField(req,res)
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.calledOnceWithExactly(MockedBlog)).to.be.true;
        });
        it('devrait pas retournée tous le blog par son titre si find error', async () => {
            findStub = sinon.stub(Blog, 'find').yields(true, {});
            const req = { params: {searchId:'MockedTitle'}};
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.getBlogByField(req,res)
            const expectedJson = {
                message: 'Impossible de récuperer le blog'
              };
            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
    });
    
    describe('DELETE /blog/get/:blogId', () => {
        afterEach(()=>{
            deleteOneStub.restore();
        })
        it('devrait supprimé un blog par son id', async () => {
            deleteOneStub = sinon.stub(Blog, 'deleteOne').yields(null, {});
            const req = {params: 'MockedIdForm'};
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.deleteBlog(req,res)
            const expectedJson = {
                message: 'le blog est bien supprimé'
              };
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
        it('devrait pas supprimé un blog si deleteOne error', async () => {
            deleteOneStub = sinon.stub(Blog, 'deleteOne').yields(true, {});
            const req = { params: 'MockedIdForm' };
            const res = {
              status: sinon.spy(),
              json: sinon.spy(),
            };
            await blogController.deleteBlog(req,res)
            const expectedJson = {
                message: 'Impossible de supprimer le blog'
              };
            expect(res.status.calledOnceWithExactly(401)).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal(expectedJson);
        });
    });
});
