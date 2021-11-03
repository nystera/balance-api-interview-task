import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server/index.js';

// Setup chai
chai.should();
chai.use(chaiHttp);

describe('hooks', function () {
  // Closes the function after all test cases
  after(function () {
    server.close();
  })
})

describe('Test', function () {
  it('should succesfully query', async function () {
    const res = await chai.request(server).get('/1');
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('USD');
    res.body.should.have.property('id');
    res.body.id.should.equal("1");
  });

  it('should give invalid id not found (non-number)', async function () {
    const res = await chai.request(server).get('/a');
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.error.should.equal("no user found in database");
  });

  it('should give invalid id not found (out of range)', async function () {
    const res = await chai.request(server).get(`/${4}`);
    res.should.have.status(404);
    res.body.should.be.a('object');
    res.body.should.have.property('error');
    res.body.error.should.equal("no user found in database");
  });
});