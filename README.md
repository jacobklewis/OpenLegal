# Open Legal

A simple document API for storing legal documents by region and language.

### Endpoint Overview
Authenticate by either the admin token or the project specific access token using this header: `x-api-key`
##### Locales
* `GET` `/locales` Get a list of both supported regions and languages
##### Projects
* `POST` `/projects` (Admin Only) Create a new project. Project ID and Project Access Token are provided in the response. *Request Body:*
  ```json
  {
    "name":"Some Project",
    "owner":"Joe Smith",
    "documentIds":["tos","pp"]
  }
  ```
* `GET: /projects/:projectId` Get Current project info
* `PUT: /projects/:projectId` Update a project. *Request Body:*
  ```json
  {
    "name":"Some Project",
    "owner":"Joe Smith",
    "documentIds":["tos","pp","imprint"]
  }
  ```
* `DELETE: /projects/:projectId` Delete a project
##### Documents
* `GET: /projects/:projectId/locales` Get all regions and locales assciated with project
* `GET: /projects/:projectId/documents` Get all project documents (all regions and locales)
* `GET: /projects/:projectId/documents/:docId/:regionCode/:languageCode` Get specific document with a specific region and language code
* `PUT: /projects/:projectId/documents/:docId/:regionCode/:languageCode` Create/Update a specific document with a specific region and language code. *Request Body:*
  ```json
  {
    "name":"Terms of Service",
    "content":"<h1>Terms of Service</h1><p>Here are the terms...</p>",
  }
  ```
* `GET: /projects/:projectId/documents/:docId/locales` Get all regions and locales assciated with a specific document

### Setup
Create an .env file with the following parameters:
* MONGO_CONNECTION
* ADMIN_TOKEN

Install Dependencies
```bash
npm install
```

Run locally with the following command:
```bash
npm run startLocal
```
*Only Edit Typescript Files*