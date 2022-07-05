const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app");
const db = require("../db/connection.js");

beforeEach(() => {
    return seed(testData);
  });
  
afterAll(() => {
    db.end();
  });
  

describe("app", () => {
    describe("3. GET /api/topics", () => {
        test("200: responds with an array of topic objects", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(( {body} ) => {
                expect(body.topics).toBeInstanceOf(Array);
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic) => {
                    expect(topic).toMatchObject(
                      {
                        slug: expect.any(String),
                        description: expect.any(String)
                      }
                    )
                })
            })
        })
          test("404: Should respond with correct error message for invalid path", () => {
            return request(app)
              .get("/api/topicZ")
              .expect(404)
              .then(({ body : {msg} }) => {
               expect(msg).toEqual("Invalid Path");
              });
          });
    })

    describe("4. GET /api/articles/:article_id", () => {
      test("status:200, responds with an article object by Id", () => {
        
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
          expect(body.article).toMatchObject({
            article_id: 2,
            author:"icellusedkars",
            title:"Sony Vaio; or, The Laptop",
            body:"Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            topic:"mitch",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
          })
        })
      })
      test("status:404 when user requests an article id that does not exist", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body : {msg} }) => {
          expect(msg).toEqual("Article not found.")
        })
      })
      test("status:400 when user request an article of an invalid type", () => {
        return request(app)
        .get("/api/articles/thisisnotanarticle")
        .expect(400)
        .then(({ body : {msg} }) => {
          expect(msg).toEqual("Bad Request!")
        })
      })
    })

    describe("5. PATCH /api/articles/:article_id", () => {
      test("status:200, responds with an article object with updated votes", () => {
        return request(app)
        .patch("/api/articles/2")
        .send({inc_votes: 5})
        .expect(200)
        .then(({body}) => {
          const updatedArticle = body.article
          expect(updatedArticle).toEqual({
            article_id: 2,
            title:"Sony Vaio; or, The Laptop",
            topic:"mitch",
            author:"icellusedkars",
            body:"Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 5,
          })
        })
      })
      test('status:400, article_id is an invalid type', () => {
        return request(app)
          .patch('/api/articles/thisisnotanarticle')
          .send({ inc_votes: -1 })
          .expect(400)
          .then(({body : {msg}}) => {
            expect(msg).toEqual('Bad Request!')
          })
      })
      test('status:404, article_id does not exist', () => {
        return request(app)
          .patch('/api/articles/999999')
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({body : {msg}}) => {
            expect(msg).toEqual('Bad Request: Invalid input data')
          })
      })
      test('status:400, invalid value for votes', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({ inc_votes: 'thisisnotacceptable' })
          .expect(400)
          .then(({body : {msg}}) => {
            expect(msg).toEqual('Bad Request!')
          })
    })
      test('status:400, no input to add', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({})
        .expect(400)
        .then(({body : {msg}}) => {
          expect(msg).toEqual('Bad request: Missing input.')
        })
    })

  });

  //  Will use these tests later for task 17, realized that task 6 only wanted to retrieve all users
  //  instead of user/user:id
  //
  //  describe.only("17. GET /api/users/username", () => {
  //   test('status:200, responds with an array of user objects', () => {
  //     return request(app)
  //     .get('/api/users/icellusedkars')
  //     .expect(200)
  //     .then(( {body} ) => {
  //       expect(body.users).toBeInstanceOf(Array);
  //       expect(body.users).toHaveLength(3)
  //       body.users.forEach((user) => {
  //           expect(user).toMatchObject(
  //             {
  //               avatar_url: expect.any(String),
  //               name: expect.any(String),
  //               username: expect.any(String)
  //             }
  //           )
  //       })
  //   })
  //   })
  //   test('status:404, username does not exist', () => {
  //     return request(app)
  //     .get('/api/users/sizenlyutfi')
  //     .expect(404)
  //     .then(({body : {msg}}) => {
  //       expect(msg).toEqual('User not found')
  //     })
  //   })
  // })
  describe("6. GET /api/users", () => {
    test("200: responds with an array of user objects", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(( {body} ) => {
            expect(body.users).toBeInstanceOf(Array);
            expect(body.users).toHaveLength(4)
            body.users.forEach((user) => {
                expect(user).toMatchObject(
                  {
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                  }
                )
            })
        })
    })
      test("404: Should respond with correct error message for invalid path", () => {
        return request(app)
          .get("/api/userZ")
          .expect(404)
          .then(({ body : {msg} }) => {
           expect(msg).toEqual("Invalid Path");
          });
      });
})

})