# Open Legal

A simple document API for storing legal documents by region and language.

### Endpoint Overview

Authenticate by either the admin token or the project specific access token using this header: `x-api-key`

##### Locales

- `GET` `/locales` Get a list of both supported regions and languages

##### Projects

- `GET` `/projects` (Admin Only) View all projects.
- `POST` `/projects` (Admin Only) Create a new project. Project ID and Project Access Token are provided in the response. _Request Body:_
  ```json
  {
    "name": "Some Project",
    "owner": "Joe Smith",
    "documentIds": ["tos", "pp"]
  }
  ```
- `GET` `/projects/:projectId` Get Current project info
- `PUT` `/projects/:projectId` Update a project. _Request Body:_
  ```json
  {
    "name": "Some Project",
    "owner": "Joe Smith",
    "documentIds": ["tos", "pp", "imprint"]
  }
  ```
- `DELETE` `/projects/:projectId` Delete a project

##### Documents

- `GET` `/projects/:projectId/locales` Get all regions and locales assciated with project
- `GET` `/projects/:projectId/documents?region=us&language=en` Get all project documents (query params optional)
- `GET` `/projects/:projectId/documents/:docId/:regionCode/:languageCode` Get specific document with a specific region and language code
- `GET` `/projects/:projectId/documents/:docId/:regionCode/:languageCode/history` Get document history
- `GET` `/projects/:projectId/documents/:docId/:regionCode/:languageCode/history/:historyId` Get a specific document from history
- `PUT` `/projects/:projectId/documents/:docId/:regionCode/:languageCode` Create/Update a specific document with a specific region and language code. _Request Body:_
  ```json
  {
    "name": "Terms of Service",
    "content": "<h1>Terms of Service</h1><p>Here are the terms...</p>"
  }
  ```
- `GET` `/projects/:projectId/documents/:docId/locales` Get all regions and locales assciated with a specific document

### Setup

Create an .env file with the following parameters:

- MONGO_CONNECTION
- ADMIN_TOKEN

Install Dependencies

```bash
npm install
```

Run locally with the following command:

```bash
npm run startLocal
```

_Only Edit Typescript Files_
