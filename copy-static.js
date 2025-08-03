const fs = require('fs');
const path = require('path');

const angularConfig = require('./angular.json');
const projectName = angularConfig.defaultProject;
const outputPath = path.join('dist', projectName, 'static.json');

const staticConfig = {
    routes: {
        "/**": "index.html"
    }
};

fs.writeFileSync(outputPath, JSON.stringify(staticConfig, null, 2));
console.log(`✅ static.json created at dist/${projectName}/`);
