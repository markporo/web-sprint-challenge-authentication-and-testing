const request = require('supertest'); // calling it "request" is a common practice
//const authRouter = require('./auth/auth-router');
const server = require('./server')
const db = require("../data/dbConfig");



// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false)
})

// it("correct env var", () => {
//   expect(process.env.DB_ENV).toBe("testing")
// })

beforeAll(async () => {
  // await db('test').truncate()
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})



describe('auth endpoints', () => {
  // http calls made with supertest return promises, we can use async/await if desired
  describe('register route', () => {
    it('should return an 201 status code from the register route', async () => {
      const expectedStatusCode = 201;

      // do a post request to our api (server.js) and inspect the response
      const response = await request(server).post('/api/auth/register').send({
        "username": "Captain Marvel",
        "password": "foobar"
      });

      expect(response.statusCode).toBe(expectedStatusCode)

    });


    it('should respond with a new user id', async () => {
      const response = await request(server).post('/api/auth/register').send({
        "username": "Captain Marvel",
        "password": "foobar"
      });

      expect(response.body.id).toBeDefined;
    });

    // it('should return a JSON object from the index route', async () => {
    //   const response = await request(server).get('/');

    //   expect(response.type).toEqual('application/json');
    // });

    // it('works correctly', () => {
    //   return request(server).get('/')
    //     .expect(201)
    //     .expect('Content-Type', /json/)
    //     .expect('Content-Length', '12')
    //     .then(res => {
    //       expect(res.body.api).toBe('....')
    //     })
    // })
  });

  describe("login route", () => {
    it("should respond with a status code of 401 due to invalid credentials", async () => {
      const response = await request(server).post("/api/auth/login").send({
        "username": "Captain Marvellllll",
        "password": "foobar"
      });

      expect(response.statusCode).toBe(401)
    })

    it('should return a JSON object from the login route', async () => {
      const response = await request(server).post('/api/auth/login').send({
        "username": "Captain Marvel",
        "password": "foobar"
      });

      expect(response.statusCode).toBe(200)
      //expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    });

  })
});


