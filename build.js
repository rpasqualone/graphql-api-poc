const childProcess = require('child_process');
const fs = require('fs-extra');
const { omit } = require('lodash');
const path = require('path');
const pkg = require('./package.json');

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'build');
const npmBin = childProcess.execSync('npm bin', { encoding: 'utf8' }).trim();

console.info(`Running a build for ${pkg.name}`);
console.info(`srcPath   = ${srcPath}`);
console.info(`buildPath = ${buildPath}`);

console.log('Clearing out any existing build files...');
fs.removeSync(buildPath);

console.log('Generating a build with babel...');
childProcess.execSync(`${npmBin}/babel ${srcPath} --out-dir ${buildPath} --source-maps --copy-files`);

console.log('Creating a Procfile for Heroku to run the web process...');
fs.writeFileSync(path.join(buildPath, 'Procfile'), 'web: npm start');

console.log('Copying package.json and package-lock.json into build...');
fs.copySync(path.resolve(__dirname, 'package.json'), path.join(buildPath, 'package.json'));
fs.copySync(path.resolve(__dirname, 'package-lock.json'), path.join(buildPath, 'package-lock.json'));

console.log('Installing production dependencies in build...');
console.log(childProcess.execSync('NODE_ENV=production npm install', { cwd: buildPath, encoding: 'utf8' }));

console.log('Deleting package-lock.json from build...');
fs.unlinkSync(path.join(buildPath, 'package-lock.json'));

console.log(
	'Creating a .npmrc file to prevent Heroku from wiping the node_modules directory when it runs `npm install`...'
);
fs.writeFileSync(path.join(buildPath, '.npmrc'), 'dry-run');

console.log('Removing dependencies from package.json to prevent Heroku from reinstalling...');
fs.writeJsonSync(path.join(buildPath, 'package.json'), omit(pkg, 'devDependencies', 'dependencies'), { spaces: 2 });
