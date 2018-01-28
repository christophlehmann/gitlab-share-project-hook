# Gitlab webhook: Share new projects with a default group

## Environment variables

* `URL`: https://your.gitlab.domain
* `ACCESS_TOKEN`: Gitlab access token with admin privileges
* `DEFAULT_GROUP`: team-members
* `DEFAULT_ACCESS_LEVEL`: 40
* `LISTEN_PORT`: 3002

## Usage with Docker

```
docker run -d \
	--name gitlab-share-project-hook \
	--restart=always \
	-e URL=https://your.gitlab.domain \
	-e ACCESS_TOKEN=GitlabAccessToken \
	-e DEFAULT_GROUP=team-members \
	-e DEFAULT_ACCESS_LEVEL=40 \
	-e LISTEN_PORT=3002 \
	-p 3002:3002 \
	lemming/gitlab-share-project-hook
```

## Usage without Docker

* Make sure you have node (https://nodejs.org) and yarn (https://yarnpkg.com)
* `yarn install`
* Set environment variables
* `node app.js`
* Add system hook in gitlab pointing to the webserver
* Create a new project

## Todo

* Implement verification of secret token

## Repository

https://github.com/christophlehmann/gitlab-share-project-hook
