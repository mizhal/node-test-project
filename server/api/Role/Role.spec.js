'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/roles', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/roles')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it("should de unique", function(done){
    var Role = app.orm.getModel("Role");

    Role.create({nombre: "admin"})
      .then(function(){
        return Role.create({nombre: "admin"});    
      })
      .then(function(){
        done();
      })
      .catch(function(error){
        done(error, null);
      });

  });
});