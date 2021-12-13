const request = require('supertest'); // calling it "request" is a common practice
//const authRouter = require('./auth/auth-router');// ----doesn't work this way
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

    beforeEach(async () => {
      await db('users').truncate()

    })

    it('should return an 201 status code from the register route', async () => {
      const expectedStatusCode = 201;

      // do a post request to our api (server.js) and inspect the response
      const response = await request(server).post('/api/auth/register').send({
        "username": "Captain Marvel",
        "password": "foobar"
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username");
      expect(response.body).toHaveProperty("password");
      expect(response.statusCode).toBe(expectedStatusCode)

    });

    it("fails upon username missing", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send({ "password": "foobar" })

      expect(response.body.message).toBe("username and password required")
    })


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

    beforeEach(async () => {
      await db('users').truncate()

    })


    it("should respond with a status code of 401 due to invalid credentials", async () => {
      const response = await request(server).post("/api/auth/login").send({
        "username": "Captain Marvellllll",
        "password": "foobar"
      });

      expect(response.statusCode).toBe(401)
    })

    it('should login a registered user', async () => {
      const response = await request(server).post('/api/auth/register').send({
        "username": "Captain Marvel",
        "password": "foobar"
      });

      const response2 = await request(server).post('/api/auth/login').send({
        "username": "Captain Marvel",
        "password": "foobar"
      });
      expect(response.statusCode).toBe(201) // registered
      expect(response2.statusCode).toBe(200) // logged in
      expect(response2.body).toHaveProperty("message");
      expect(response2.body).toHaveProperty("token");

      //expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    });

    it("will not log in a user without registering first", async () => {
      const response = await request(server).post('/api/auth/login').send({
        "username": "Captain Marvel",
        "password": "foobar"
      })
      expect(response.body).not.toHaveProperty("token")
    })

  })
});


