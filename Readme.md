# Node server: Gitlab system hook

* Share newly created project with a default group

## Environment variables

* `URL`: https://your.gitlab.domain
* `ACCESS_TOKEN`: Gitlab access token with admin privileges
* `DEFAULT_GROUP`: team-members
* `DEFAULT_ACCESS_LEVEL`: 40
* `LISTEN_PORT`: 3002

## Prerequisites

* Node.js (https://nodejs.org)
* yarn (https://yarnpkg.com)

## Usage

* `yarn install`
* Set environment variables
* `node app.js`
* Add system hook in gitlab pointing to the webserver
* Create a new project

## Todo

* Implement verification of secret token
