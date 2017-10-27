// 'use strict';

// if (!global.Promise) {
//   global.Promise = require('q');
// }
// //Is this necessary? If so, why? If not, why not?
// const {DATABASE_URL, PORT} = require('../config');
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const jwt = require('jsonwebtoken');
// const {app, runServer, closeServer} = require('../server.js');
// const User = require('../server/user/user.model.js');
// const {JWT_SECRET_KEY} = require('../config');
// const expect = chai.expect;
// chai.use(chaiHttp);

// const email = 'daniel@example.com';
// const password = '12345678';

// let Cookie;

// describe('Breed endpoint', function() {

//   before(function () {
//     return runServer(DATABASE_URL, PORT);
//   });

//   after(function() {
//     return closeServer();
//   });

//   beforeEach(function(done) {
//     User.create({email, password})
//       .then(function() {
//         chai.request(app)
//           .post('/auth/login')
//           .send({email, password})
//           .end(function(err, res) {
//             Cookie = res.headers['set-cookie'].pop().split(';')[0].substr(13);
//             done();
//           });
//       });
//   }); 

//   afterEach(function() {
//     return User.remove({email});
//   });
  

//   describe('Breed page', function() {
//     it('Should add breed to favorites when favorites button clicked', function() {
//       return chai 
//         .request(app)
//         .post('/api/favorites/akita')
//         .set('woofle-token', Cookie)
//         .then(function(err, res) {
//           expect(res).to.be.an('array');
//           expect(res).to.have.lengthOf(1);
//         })
//         .catch(function (err) {
//         });
//     });
//     it('Should go back to search page when search button is clicked', function() {
//       return chai
//         .request(app)
//         .get('/search')
//         .set('woofle-token', Cookie)
//         .then(function(err, res) {
//           expect(res).to.redirect();
//           expect(res).to.have.status(200);
//         })
//         .catch(function (err) {
//         });
//     });
//     it('should go to my favorites page when my favorites button clicked', function() {
//       return chai
//         .request(app)
//         .get('/favorites')
//         //the route doesn't need a slash even though there is one in the router
//         .set('woofle-token', Cookie)
//         .then(function(err, res) {
//           expect(res).to.have.status(200);
//         })
//         .catch(function (err) {
//         });
//     });
//     it('should remove the token if the user clicks the logout button', function() {
//       return chai
//         .request(app)
//         .get('/auth/logout')
//         .set('woofle-token', Cookie)
//         .then(function(err, res) {
//           expect(res).to.have.status(302);
//           expect(res).to.redirectTo('/auth/login');
//           expect(res).to.not.have.cookie('woofle-token');
//         })
//         .catch(function (err){
//         }); 
//     });
//   });
// });