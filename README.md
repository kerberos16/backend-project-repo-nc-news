# NC NEWS APP - BACKEND PROJECT WITH NORTHCODERS

Hello reader!

NC News is a web application which is designed to function as a repository for news articles. It will retrieve, add, update and delete information from a database when requests are made. The user will be able to access information about articles, comments, topics and users.

The hosted version of the application can be found [here](https://sizens-nc-news-app.herokuapp.com/api)

## Getting Started

1. Please clone this repository from [here](https://github.com/kerberos16/backend-project-repo-nc-news)

2. cd into the repository
cd backend-project-repo-nc-news

3. Install dependencies

```
npm install jest -D

npm install supertest

npm install express

npm install pg

npm install nodemon

npm install dotenv
```

4. After you have installed the dotenv package you would need to create two files to set up the development environment. It is essential that these files be in the root directory of the repository.
The files to be create are:

```
.env.development
.env.test
```

Please also add the following contents to each files respectively:

```
PGDATABASE=nc_news
PGDATABASE=nc_news_test
```

5. Run the "setup-dbs" script
npm run setup-dbs

6. Run the seed script
npm run seed

Enpoints

**GET** `/api
```json
{
    "GET /api/articles": {
      "description": "serves an array of all articles and articles_count which is the total number of articles before limit and p is queried",
      "queries": [
        "author",
        "topic",
        "sort_by",
        "order",
        "limit",
        "p"
      ],
      "request.body": {},
      "exampleResponse": {
        "articles": [
          {
            "article_id": 1,
            "author": "butter_bridge",
            "created_at": "2018-11-15T12:21:54.171Z",
            "title": "Living in the shadow of a great man",
            "topic": "mitch",
            "votes": 100,
            "comment_count": "13"
          }
        ],
        "articles_count": 22
      }
    }
}
```
**GET** `/api/topics
```json
{
      "slug": "coding",
      "description": "Code is love, code is life"
}
```
**GET** `/api/users/:username
```json
{
  "user": {
    "username": "jessjelly",
    "avatar_url": "https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg",
    "name": "Jess Jelly"
  }
}
```
**GET** `/api/articles?topic=[topic]&sort_by=[author/topic/title/topic/body/created_at/votes/comment_count]&order=[asc/desc]

This query will retrieve articles that can be filtered by the article topic. The default sorting order is by the created_at column in descending order.

```json
 {
  "articles": [
    {
      "article_id": 1,
      "author": "jessjelly",
      "created_at": "2017-07-21T17:54:10.346Z",
      "title": "Running a Node App",
      "topic": "coding",
      "votes": 0,
      "comment_count": "8"
    }],
}
```
**GET** `/api/articles/:article_id
```json
{
  "article": {
    "article_id": 3,
    "title": "22 Amazing open source React projects",
    "body": "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11)...",
    "votes": 2,
    "topic": "coding",
    "author": "happyamy2016",
    "created_at": "2017-07-21T17:54:10.346Z",
    "comment_count": "10"
  }
}
```
**PATCH** `/api/articles/:article_id
```json
{
"inc_votes": "newVote"
}
```
**GET** `/api/articles/:article_id/comments
```json
{
    "comments": [
        {
    "comment_id": 1,
    "body": "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
    "votes": 7,
    "author": "grumpy19",
    "created_at": 1577890920000,
        }
    ]
}
```
**POST** `/api/articles/:article_id/comments
```json

{
   "comment": {
    "comment_id": 3,
    "votes": 3,
    "created_at": "2017-08-31T12:51:40.263Z",
    "author": "grumpy19",
    "body": "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat.
  }
}

```
**PATCH** `/api/comments/:comment_id
```json
```json
{
"inc_votes": "newVote"
}
```
**DELETE** `/api/comments/:comment_id

This method deletes a comment with the specified comment_id

## Testing

Testing has been done with supertest. The sorting tests have been carried with the jest-sorted extension.
To run the tests, you can go into the test directory and run:

```
npm test
```

## Built with

Please make sure you have the latest version of the below:

```
* node - A Javascript runtime built on Chrome's V8 Javascript engine (minimum version 13.9.0)
* express - A Node.js web application framework
* postgresSQL - The world's most Advanced Open Source Relational Database
* supertest - A HTTP assertions made easy via superagent
* jest-sorted - Used for testing if an array has sorted values
```

## Author
**Sizen Lyutfi** - [kerberos92](https://github.com/kerberos16)

