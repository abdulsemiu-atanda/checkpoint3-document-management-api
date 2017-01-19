[![Coverage Status](https://coveralls.io/repos/github/andela-aatanda/checkpoint3-document-management-api/badge.svg?branch=development)](https://coveralls.io/github/andela-aatanda/checkpoint3-document-management-api?branch=development)
[![Build Status](https://travis-ci.org/andela-aatanda/checkpoint3-document-management-api.svg)](https://travis-ci.org/andela-aatanda/checkpoint3-document-management-api)
# Document Management API

This application provides REST API enpoints for a document management system. It allows create, retrieve, update and delete actions to be carried out.
It also ensures that users are authorized.

## Development
This application was developed using [NodeJs](https://nodejs.org) with express for routing. Postgres was user for persisting data with [Sequelize](https://sequelizejs.org) as [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)

## Installation
- Ensure that you have NodeJs and Postgres installed on your machine
- Clone the repository `$ git clone https://github.com/andela-aatanda/checkpoint3-document-management-api.git`
- Change your directory `$ cd checkpoint3-document-management-api`
- Install dependencies `$ npm install`
- Create a `.env` file in your root directory as described in `.env.sample` file

## Testing
- Run seeders `$ NODE_ENV=test npm run seed`
- Run Test `$ NODE_ENV=test npm test`

## Usage
- Start the app with `$ npm start`
- Use [Postman](https://www.getpostman.com) to consume available endpoints

**Users**:
A created user will have a role, either an admin or a regular user by default.
- A Regular User can: 
    - Create an account
    - Login
    - Create a document
    - Limit access to a document by specifying an access group `i.e. public, private or role`.
    - View public documents created by other users.
    - View documents created by his access group with access level set as `role`.
    - Edit his record.
    - Search a users public documents.
    - View `public` and `role` access level documents of other regular users.
    - Logout.
    - Delete his details.

- In addition to the general user functions, an admin user can:
    - View all users.
    - View all created documents.
    - Delete any user.
    - Update any user's record.
    - Create a new role.
    - View all created roles.
    - Search for any user.

**Documents**:
Documents are created to have various properties.
They include:
- Published date
- Title
- Content
- Access (`private, public or role`)

**Roles**:
Roles can also be created, the default roles are `admin` and `regular`

**Authentication**:
Users are authentcated and validated using JSON web token (JWT).
By generating a token on registration and login, API endpoints and documents are protected from unauthorised access.
Requests to protected routes are validated using the generated token.

## Endpoints
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3b0855101a157a960224)

**Users**

Request type | Endpoint | Action 
------------ | -------- | ------
POST | [/api/users](#create-users) | Create a new user
GET | [/api/users](#get-users) | Get all users
GET | [/users/?id=id](#get-a-user) | Get details of a specific user
PUT | [/api/users?id=id](#update-user) | Edit user details
DELETE | [/api/users?id=id](#delete-user) | Remove a user from storage
GET | [/api/users/login](#login) | To log a user in
GET | [/api/users/logout](#logout) | To log a user out

**Roles**

Request type | Endpoint | Action 
------------ | -------- | ------
POST | [/api/role](#create-role) | Create a new role
GET | [/api/role](#get-roles) | Get all created roles

**Documents**

Request type | Endpoint | Action 
------------ | -------- | ------ 
POST | [/api/document](#create-document) | Create a new document
GET | [/api/document](#get-documents) | Retrieve all documents 
GET | [/api/document/?id=id](#get-a-document) | Retrieve a specific document
GET | [/api/users/:id/document](#get-documents-by-user) | Retrieve all documents created by a user
GET | [/api/document?order=desc&limit=10](#get-documents) | Retrieve maximum of first 10 documents ordered by date of creation
PUT | [/api/document/:id](#update-document) | Update a specific document
DELETE | [/api/documents/?id=id](#delete-document) | Remove a specific document from storage

## Collaboration
To contribute to this project you can do the following:
- Clone this repository as described in **Installation**
- Checkout to your feature branch `$ git checkout -b <YOUR_FEATURE>`
- Submit a pull request

## Contributors
- [Abdulsemiu Atanda](https://github.com/andela-aatanda)