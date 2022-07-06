const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app");
const db = require("../db/connection.js");
const jestSorted = require("jest-sorted");


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
  })

  describe("7. GET api/articles/:article_id", () => {
    test("status:200, responds with an article object including a comment count property", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({body}) => {
          expect(body.article).toMatchObject({
            article_id: 9,
            author:"butter_bridge",
            title:"They're not exactly dogs, are they?",
            body:"Well? Think about it.",
            topic:"mitch",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            comment_count: 2
          })
        });
    });
})
  describe("8. GET api/articles", () => {
    test("status:200, responds with all articles sorted by date in descending order containing author, article_id, topic, created_at, votes and comment_count property", () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(12)
                body.articles.forEach((article) => {
                    expect(article).toMatchObject(
                      {
                        author: expect.any(String),
                        title: expect.any(String),
                        topic: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                      }
                    )
                })
      })
    })
  })

  describe("9. GET /api/articles/:article_id/comments", () => {
    test("status: 200, responds with all comments for a given article", () => {
      return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(2)
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id:expect.any(Number),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body:expect.any(String)
          })
        })
      })
    })
    test('status:404, valid article_id but does not exist in database', () => {
      return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body : {msg}}) => {
          expect(msg).toEqual('Article Id does not exist.')
        })
    })
    test("status:404, responds with correct error message for invalid path", () => {
      return request(app)
        .get("/api/articles/1/NOTcomments")
        .expect(404)
        .then(({ body : {msg} }) => {
         expect(msg).toEqual("Invalid Path");
        });
  });
     test("status: 200, responds with an emptry array if article exists, but without any comments", () => {
      return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body}) => {
      expect(body.comments).toBeInstanceOf(Array);
      expect(body.comments).toHaveLength(1)
    })
  })
  })

  describe("10 POST /api/articles/:article_id/comments", () => {
    test("status: 201 responds with a newly posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "icellusedkars",
          body: "If I were you, I would have spoken to the manager",
        })
        .expect(201)
        .then(({body}) => {
          expect(body.comment).toMatchObject({
            comment_id: 19,
            body: "If I were you, I would have spoken to the manager",
            article_id: 1,
            author: "icellusedkars",
            created_at: expect.any(String)
          });
        });
    });
    test("status: 400 responds with an error if the input is not in the correct format", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "icellusedkars",
          last_active: "2h 42mins",
        })
        .expect(400)
        .then(({body : {msg}}) => {
          expect(msg).toEqual("Bad request: Invalid input parameters");
        });
    });
    test("status: 400 responds with an error if the username does not exist in the database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "kerberos92",
          body: "If I were you, I would have spoken to the manager",
        })
        .expect(404)
        .then(({body : {msg}}) => {
          expect(msg).toEqual("Path not found!");
        });
    });
  });

  describe("11 GET query /api/articles?sort_by=created_at&order=desc", () => {
    test("status: 400 returns articles sorted by the default criteria of created_at column and descending order", () => {
      return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200).then(({body}) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true
        })
      })
    })
    test("status: 400 returns articles sorted by the author criteria and ascending order", () => {
      return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200).then(({body}) => {
        expect(body.articles).toBeSortedBy("author", {
          descending: false
        })
      })
    })
    test("status: 200 returns with an array of CATS topics only", () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200).then(({body}) => {
        expect(body.articles).toHaveLength(1)
        body.articles.forEach((article) => {
          expect(article.topic).toEqual("cats")
        })
      })
    })
    test("status 404: responds with an error when passed an invalid topic", () => {
      return request(app)
      .get("/api/articles?topic=linguistics")
      .expect(404).then(({body : {msg}}) =>{
        expect(msg).toEqual("Bad Request: Invalid input data.")
      })
    })
    test("status 404: responds with an error when passed an invalid sort by option", () => {
      return request(app)
      .get("/api/articles?sort_by=mood")
      .expect(404).then(({body : {msg}}) =>{
        expect(msg).toEqual("Bad Request: Invalid input data.")
      })
    })
  })
  })
  

