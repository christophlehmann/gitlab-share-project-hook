'use strict'

let express = require('express'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    morgan = require('morgan'),
    compression = require('compression');

const url = process.env.URL,
    accessToken = process.env.ACCESS_TOKEN,
    defaultGroup = process.env.DEFAULT_GROUP,
    defaultAccessLevel = process.env.DEFAULT_ACCESS_LEVEL,
    port = process.env.LISTEN_PORT; // 3002

const gitlab = require('node-gitlab-api')({
    url: url,
    token: accessToken
});

// Work
verifyEnvironment();
getGroupByName(defaultGroup)
    .then(group => {
        if (typeof group == 'undefined') {
            console.log('Default group ' + defaultGroup + ' not found')
            process.exit(1);
        }
        startWebserver(group);
});

// Functions
function verifyEnvironment() {
    if (typeof url == 'undefined') {
        console.log('URL not set');
        process.exit(1);
    }
    
    if (typeof accessToken == 'undefined') {
        console.log('ACCESS_TOKEN not set');
        process.exit(1);
    }
    
    if (typeof defaultGroup == 'undefined') {
        console.log('DEFAULT_GROUP not set');
        process.exit(1);
    }
    
    if (typeof defaultAccessLevel == 'undefined') {
        console.log('DEFAULT_ACCESS_LEVEL not set');
        process.exit(1);
    }
    
    if (typeof port == 'undefined') {
        console.log('LISTEN_PORT not set');
        process.exit(1);
    }
}

async function getGroupByName(name) {
    const result = await gitlab.groups.search(name);
    const group = result.find(function(item){
        if (item.name == name) {
            return item;
        }
    });
    return group;
} 

function startWebserver(defaultGroup) { 
    var webserver = express();

    webserver.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));

    webserver.use(morgan('combined'));
    webserver.use(compression());

    // parse various different custom JSON types as JSON
    webserver.use(bodyParser.json({ type: 'application/json' }));

    webserver.get('/', function (req, res) {
        res.send('Hello, please give me a POST!\n');
    });

    webserver.post('/', function (req, res) {

        console.log(JSON.stringify(req.body));

        if (req.body['event_name'] == 'project_create') {
            /*
                Example request:

                {
                "project_id" : 1,
                "owner_email" : "example@gitlabhq.com",
                "owner_name" : "Someone",
                "name" : "Ruby",
                "path" : "ruby",
                "event_name" : "project_create"
                }

            */

            // The options object is obselete when https://github.com/jdalrymple/node-gitlab-api/pull/9 is merged
            let options = new Object;
            options.group_access = defaultAccessLevel;

            // Share project with group
            let share = gitlab.projects.share(
                req.body['project_id'],
                defaultGroup.id,
                defaultAccessLevel,
                options);
            share.then(console.log('Shared project ' + req.body['project_id'] + ' with group ' + defaultGroup.id));
        }

        res.send('Got it.');
    });

    webserver.listen(port);
    console.log('Webserver is listening on ' + port);
}