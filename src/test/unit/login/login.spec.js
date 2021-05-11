const request = require('supertest');
const serverRouter = require('../../../server');

describe('Login for faculty', function () {

    it('respond with 302 code', function (done) {
        request(serverRouter.app)
            .post('/login1')
            .send({username : "faculty1", password : "mypassword1"})
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(302, done);
    });

    it('respond with 302 code', function (done) {
        request(serverRouter.app)
            .post('/login1')
            .send({username : "faculty2", password : "mypassword2"})
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(302, done);
    });

    it('respond with 302 code', function (done) {
        request(serverRouter.app)
            .post('/login1')
            .send({username : "faculty", password : "mypassword"})
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(302, done);
    });
});

describe('Login for admin', function () {

    it('respond with 302 code', function (done) {
        request(serverRouter.app)
            .post('/login2')
            .send({username : "admin1", password : "mypassword1"})
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(302, done);
    });

    it('respond with 302 code', function (done) {
        request(serverRouter.app)
            .post('/login2')
            .send({username : "admin2", password : "mypassword2"})
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(302, done);
    });

    it('respond with 302 code', function (done) {
        request(serverRouter.app)
            .post('/login2')
            .send({username : "admin", password : "mypassword"})
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(302, done);
    });
});
