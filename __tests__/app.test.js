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

    // ///Error tests for /api
    // describe("tests for /api paths" , () => {
    //     describe("initial test for an invalid path", () => {
    //         test("404: gives an error when user inputs invalid path", () => {
    //             return request(app)
    //             .get("/can-I-enter")
    //             .expect(404)
    //             .then(({ body : {msg} }) => {
    //                 expect(msg).toEqual(
    //                     "Invalid Path"
    //                 )
    //             })

    //         })
    //     })
    // })

    ////Tests for the /api/topics path
    describe("GET test for /api/topics", () => {
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
        // test("404: responds with an error when the request method is different than GET", () => {
        //     const invalidMethods = ["delete", "patch", "post"];
        //     const requests = invalidMethods.map((httpRequestMethod) => {
        //       return request(app)
        //       [httpRequestMethod]("/api/topics")
        //         .expect(404)
        //         .then(({ body : {msg}}) => {
        //           expect(msg).toEqual(
        //             `Invalid Path`
        //           );
        //         });
        //     });
        //     return Promise.all(requests);
        //   });
          test("404: Should respond with correct error message for invalid path", () => {
            return request(app)
              .get("/api/topicZ")
              .expect(404)
              .then(({ body : {msg} }) => {
               expect(msg).toEqual("Invalid Path");
              });
          });
    })

    describe("/:articleID test", () => {
      test("status:200, responds with an article object including comment count property", () => {
        
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
      test.only("status:404 when user requests an article id that does not exist", () => {
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
})