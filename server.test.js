const request = require("supertest");

var app = require("./server").app;
/*
it("should return Hello Test", function (done) {

    request(app)
        .get("/")
        .expect("Hello Test")
        .end(done);
});*/
describe('POST /users', function () {
    it('login true', function (done) {
        request(app)
            .post('/users')
            .send({ name: 'Коваленко', pass: '123' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
    
});
//npm test