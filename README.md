Hello reader!

NC News is a web application which is designed to function as a repository for news articles. It will retrieve, add, update and delete information from a database when requests are made. The user will be able to access information about articles, comments, topics and users.

Getting Started

1. Please clone this repository from *insert url at a later point*

2. cd into the repository
cd backend-project-repo-nc-news

3. Install dependencies

npm install jest -D

npm install supertest

npm install express

npm install pg

npm install nodemon

npm install dotenv

4. After you have installed the dotenv package you would need to create two files to set up the development environment. It is essential that these files be in the root directory of the repository.
The files to be create are:

.env.development
.env.test

Please also add the following contents to each files respectively:

PGDATABASE=nc_news
PGDATABASE=nc_news_test

5. Run the "setup-dbs" script
npm run setup-dbs

6. Run the seed script
npm run seed