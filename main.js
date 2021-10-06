const core = require('@actions/core');
const fs = require('fs');
const set = require('lodash.set');
const get = require('lodash.get');

function saveTheFile(jsonFile, fileContents) {
  core.info(`Saving changes to ${jsonFile}...`);
  const space = core.getInput('space');
  const indentSpace = space && space.length > 0 ? parseInt(space) : 2;
  const jsonData = JSON.stringify(fileContents, null, indentSpace);
  fs.writeFileSync(jsonFile, jsonData, 'utf8');
  core.info(`Finished Saving ${jsonFile}`);
}

function applyTheChanges(jsonFile, fileContents, propertiesToAddOrUpdate) {
  core.startGroup(`Updating ${jsonFile}...`);

  propertiesToAddOrUpdate.forEach(update => {
    let propName = Object.keys(update)[0];
    let propValue = update[propName];

    let beforeValue = get(fileContents, propName);
    set(fileContents, propName, propValue);
    let afterValue = get(fileContents, propName);
    core.info(`${propName}: ${beforeValue} => ${afterValue}`);
  });
  core.info(`Finished updating ${jsonFile}`);
  core.endGroup();
}

function readTheDataFromFile(jsonFile) {
  core.info(`Opening ${jsonFile}...`);
  const rawdata = fs.readFileSync(jsonFile, 'utf8');
  core.info('Returning parsed json file');

  let fileContents = '{}';
  if (rawdata && rawdata.trim().length > 0) {
    fileContents = JSON.parse(rawdata);
  }
  return fileContents;
}

function parseTheUpdates(propertiesToAddOrUpdateRaw) {
  if (!propertiesToAddOrUpdateRaw || propertiesToAddOrUpdateRaw.length === 0) {
    core.info('There were no properties to add or update.');
    return [];
  }

  const propertiesToAddOrUpdate = JSON.parse(propertiesToAddOrUpdateRaw);
  if (!propertiesToAddOrUpdate || propertiesToAddOrUpdate.length === 0) {
    core.info('There were no properties to add or update.');
    return [];
  }

  return propertiesToAddOrUpdate;
}

function run() {
  const propertiesToAddOrUpdateRaw = core.getInput('properties-to-update-or-add');
  const propertiesToAddOrUpdate = parseTheUpdates(propertiesToAddOrUpdateRaw);
  if (!propertiesToAddOrUpdate || propertiesToAddOrUpdate.length === 0) return;

  const jsonFile = core.getInput('path-to-json-file');
  const fileContents = readTheDataFromFile(jsonFile);

  applyTheChanges(jsonFile, fileContents, propertiesToAddOrUpdate);

  saveTheFile(jsonFile, fileContents);
}

try {
  core.warning(
    'This action has been deprecated.  Use https://github.com/microsoft/variable-substitution instead.'
  );
  run();
} catch (error) {
  core.setFailed(`An error occurred while processing the file: ${error.message}`);
}
