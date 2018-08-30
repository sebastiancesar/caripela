#!/usr/bin/env node

'use strict';

const fs = require('fs');
const _ = require('lodash');
const xml2js = require('xml2js');

module.exports = function (context) {
  const parseString = xml2js.parseString;
  const builder = new xml2js.Builder();
  const manifestPath = context.opts.projectRoot + '/platforms/android/app/src/main/res/xml/config.xml';
  const androidManifest = fs.readFileSync(manifestPath).toString();

  let manifestRoot;

  if (androidManifest) {
    parseString(androidManifest, (err, manifest) => {
      if (err) return console.error(err);

      manifestRoot = manifest['widget'];
        console.log(manifestRoot['content']);        
        manifestRoot['content'] = [ { '$': 
        { 'original-src': 'https://192.168.0.155:8100/index.html',
            'src': 'https://192.168.0.155:8100' } } ];    

      fs.writeFileSync(manifestPath, builder.buildObject(manifest));      
    })
  }
};
