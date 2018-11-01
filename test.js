const assert = require("assert");
let server = require('./bin/www');


//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('userauth', () => {
    describe('/GET auth page', () => {
        it('it should GET auth page', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    '3'.should.be.eql('3');
                    done();
                });
        });
    });
    describe('/POST auth page', () => {
        it('it should POST nothing and return 400', (done) => {
            chai.request(server)
                .post('/')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Пользователь не зарегистрирован в аукционе!');
                    done();
                });
        });
        it('it should POST nickname and return data about user', (done) => {
            chai.request(server)
                .post('/')
                .send({nickname: 'Ivan'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    Object.keys(res.body).length.should.be.eql(3);
                    res.body.should.have.property('message').eql('User successfully authorized!');
                    res.body.should.have.property('nickname');
                    res.body.should.have.property('money');
                    done();
                });
        });
    });
});

describe('index', () => {
    describe('/GET user page', () => {
        it('it should GET 400 w/o user data', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    Object.keys(res.body).length.should.be.eql(1);
                    res.body.should.have.property('message').eql('Отсутствуют данные пользователя!');
                    done();
                });
        });
        it('it should GET userpage', (done) => {
            chai.request(server)
                .get('/user?name=Ivan&money=5000000')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
    describe('/GET admin page', () => {
        it('it should GET adminpage', (done) => {
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({});
                    done();
                });
        });
    });
});