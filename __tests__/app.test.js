const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app");
const db = require("../db/connection.js");
const jestSorted = require("jest-sorted");
const json = require("../endpoints.json")


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
    test("status: 200 returns articles sorted by the default criteria of created_at column and descending order", () => {
      return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200).then(({body}) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true
        })
      })
    })
    test("status: 200 returns articles sorted by the author criteria and ascending order", () => {
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
    test("status: 200 returns with an array of MITCH topics only, sorted by title in ascending order", () => {
      return request(app)
      .get("/api/articles?sort_by=title&order=asc&topic=mitch")
      .expect(200).then(({body}) => {
        expect(body.articles).toHaveLength(11)
        expect(body.articles).toBeSortedBy("title", {
          descending: false
        })
        body.articles.forEach((article) => {
          expect(article.topic).toEqual("mitch")
        })
      })
    })
    test("status 404: responds with an error when passed an invalid order", () => {
      return request(app)
      .get("/api/articles?order=horizontal")
      .expect(404).then(({body : {msg}}) =>{
        expect(msg).toEqual("Bad Request: Invalid input data.")
      })
    })
    test("status 404: responds with an error when passed an invalid sort_by", () => {
      return request(app)
      .get("/api/articles?sort_by=publisher")
      .expect(404).then(({body : {msg}}) =>{
        expect(msg).toEqual("Bad Request: Invalid input data.")
      })
    })
    test("status 404: responds with an error when passed an invalid topic", () => {
      return request(app)
      .get("/api/articles?topic=linguistics")
      .expect(404).then(({body : {msg}}) =>{
        expect(msg).toEqual("Bad request: Invalid input topic")
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
    describe("12 DELETE /api/comments/:comment_id", () => {
      test("status 204: deletes a comment", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({body }) => {
            expect(body).toEqual({});
          });
      });
      test('status 404: responds with an error if endpoint is invalid', () => {
        return request(app)
        .delete('/api/comments/thisisnotavalidcomment')
        .expect(400)
        .then(({body : {msg}})=> {
            expect(msg).toEqual('Bad Request!')
        })
    });
    test('status 404: returns an error if comment_id does not exist', () => {
      return request(app)
      .delete('/api/comments/239')
      .expect(404)
      .then(({body : {msg}})=> {
          expect(msg).toEqual('Page not found: Comment does not exist')
      })
  });
    });
    describe("13 GET /api", () => {
      test("status: 200, reposnds with a json object of all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
          expect(body.api).toBeInstanceOf(Object)
          expect(body.api).toEqual(json)
        })
      })
    })
    describe("16. GET /api/users/:username", () => {
      test("status:200, responds with a user object by username", () => {
        return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({body}) => {
          expect(body.user).toMatchObject( {
            username: 'icellusedkars',
            name: 'sam',
            avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
          },)
        })
      })
      test("status:404 when user requests a username that does not exist", () => {
        return request(app)
        .get("/api/users/kerberos92")
        .expect(404)
        .then(({ body : {msg} }) => {
          expect(msg).toEqual("User not found!")
        })
      })
      test("status:400 when user request an article of an invalid type", () => {
        return request(app)
        .get("/api/users/3")
        .expect(404)
        .then(({ body : {msg} }) => {
          expect(msg).toEqual("User not found!")
        })
      })
    })

    describe("18. PATCH /api/comments/:comment_id", () => {
      test("status:200, responds with a comment object with updated votes", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes: 4})
        .expect(200)
        .then(({body}) => {
          const updatedComment = body.comment
          expect(updatedComment).toMatchObject({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 20,
            author:"butter_bridge",
            article_id: 9,
            created_at: expect.any(String)
          })
        })
      })
      test('status:400, comment_id is an invalid type', () => {
        return request(app)
          .patch('/api/comment/thisisnotacomment')
          .send({ inc_votes: -1 })
          .expect(404)
          .then(({body : {msg}}) => {
            expect(msg).toEqual('Invalid Path')
          })
      })
      test('status:404, comment_id does not exist', () => {
        return request(app)
          .patch('/api/comments/999999')
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({body : {msg}}) => {
            expect(msg).toEqual('Bad Request: Invalid input data')
          })
      })
      test('status:400, invalid value for votes', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'thisisnotacceptable' })
          .expect(400)
          .then(({body : {msg}}) => {
            expect(msg).toEqual('Bad Request!')
          })
    })
      test('status:400, no input to add', () => {
        return request(app)
        .patch('/api/comments/3')
        .send({})
        .expect(400)
        .then(({body : {msg}}) => {
          expect(msg).toEqual('Bad request: Missing input.')
        })
    })

  });

  describe("19 POST /api/articles", () => {
    test("status: 201 - responds with an object of the posted article. Author/username and topic are foreign key constraints, so their values cannot be new", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "How to Tell If Your Cat Is Plotting to Kill You",
          topic: "cats",
          username: "rogersop",
          body: "The book will be designed to create suspense/anticipation with page turns analogous to the experience of scrolling down through the panels on the website. For example, Cat vs. Internet will use page turns to draw out the reader's anticipation of what the crafty kitty might do next to get attention from his Internet-fixated owner."
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            title: "How to Tell If Your Cat Is Plotting to Kill You",
            topic: "cats",
            author: "rogersop",
            body: "The book will be designed to create suspense/anticipation with page turns analogous to the experience of scrolling down through the panels on the website. For example, Cat vs. Internet will use page turns to draw out the reader's anticipation of what the crafty kitty might do next to get attention from his Internet-fixated owner.",
            votes: 0,
            created_at: expect.any(String)
        });
        });
    });
    test("status: 400 - responds with an error due to an invalid/empty body", () => {
      return request(app)
      .post("/api/articles")
      .send({})
      .expect(400)
      .then(({ body : {msg}}) => {
        expect(msg).toEqual("Bad Request: Invalid input data");
      });
    })
    test("status: 404 - responds with an error if user does not exist", () => {
      return request(app)
      .post("/api/articles")
      .send({
        title: "How to Tell If Your Cat Is Plotting to Kill You",
        topic: "cats",
        username: "someonewhoisnotinthedatabase",
        body: "This body is a filler just for this test and does not represent the amazing content of the book title"
      })
      .expect(404)
      .then(({ body : {msg} }) => {
        expect(msg).toEqual("Path not found!");
      });
    })
    test("status: 404 - responds with an error if topic does not exist", () => {
      return request(app)
      .post("/api/articles")
      .send({
        title: "How to Tell If Your Cat Is Plotting to Kill You",
        topic: "dogs",
        username: "rogersop",
        body: "This body is a filler just for this test and does not represent the amazing content of the book title"
      })
      .expect(404)
      .then(({ body : {msg} }) => {
        expect(msg).toEqual("Path not found!");
      });
    })
  })

})
