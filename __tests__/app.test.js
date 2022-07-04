const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app");
const db = require("../db/connection.js");

beforeEach(() => {
    return seed(testData);
  });
  
afterAll(() => {
    return db.end();
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
      test.only("status:200, responds with an article object including comment count property", () => {
        
        return request(app)
        .get("/api/article/2")
        .expect(200)
        .then(({body}) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            author:expect.any(String),
            title:expect.any(String),
            body:expect.any(String),
            topic:expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
          })
        })
      })
      test("status:404 when user requests an article id that does not exist", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body : {msg} }) => {
          expect(msg).toEqual("Invalid Path")
        })
      })
      test("status:400 when user request an article of an invalid type", () => {
        return request(app)
        .get("api/articles/thisisnotanarticle")
        .expect(404)
        .then(({ body : {msg} }) => {
          expect(msg).toEqual("Invalid Path")
        })
      })
    })
})