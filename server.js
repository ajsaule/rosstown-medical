(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('SG.kQpUJ1VCTqGDek-WDhW4WQ.-8K4iasCpHOwEEYu5KKRmHHsvhu-OHY1FPQENk')

const msg = {
    to: 'andrejsaule8@gmail.com', // Change to your recipient
    from: `${emailContents}`, // Change to your verified sender
    subject: 'This is a test email',
    // text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>This is a message from ${nameContents}: ${messageContents} </strong>`
}
  
//process.env.SENDGRID_API_KEY

const sendMail = () => {
  sgMail
      .send(msg)
      .then(() => {
          console.log('Email sent')
      })
      .catch((error) => {
          console.error(error)
      })
}

// module.exports = {
//     sendMail
// }

},{"@sendgrid/mail":28}],2:[function(require,module,exports){
'use strict';

const client = require('./src/client');
const Client = require('./src/classes/client');

module.exports = client;
module.exports.Client = Client;

},{"./src/classes/client":4,"./src/client":5}],3:[function(require,module,exports){
module.exports={
  "_from": "@sendgrid/client@^7.3.0",
  "_id": "@sendgrid/client@7.3.0",
  "_inBundle": false,
  "_integrity": "sha512-vY5IwcyDrOeeqyp5nQePRP2MC+Q+fTk9dpBt8SbUgYbRy4OVkyoROTxo1syRk0u7h7bIDMctLdRJxw/ETFA6tg==",
  "_location": "/@sendgrid/client",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "@sendgrid/client@^7.3.0",
    "name": "@sendgrid/client",
    "escapedName": "@sendgrid%2fclient",
    "scope": "@sendgrid",
    "rawSpec": "^7.3.0",
    "saveSpec": null,
    "fetchSpec": "^7.3.0"
  },
  "_requiredBy": [
    "/@sendgrid/mail"
  ],
  "_resolved": "https://registry.npmjs.org/@sendgrid/client/-/client-7.3.0.tgz",
  "_shasum": "a19c4ec02da304d16ae2480e121083c82a296144",
  "_spec": "@sendgrid/client@^7.3.0",
  "_where": "/Users/ajsaule/Documents/GA/dev/rosstown-medical/node_modules/@sendgrid/mail",
  "author": {
    "name": "Twilio SendGrid",
    "email": "help@twilio.com",
    "url": "sendgrid.com"
  },
  "bugs": {
    "url": "https://github.com/sendgrid/sendgrid-nodejs/issues"
  },
  "bundleDependencies": false,
  "contributors": [
    {
      "name": "Kyle Partridge",
      "email": "kyle.partridge@sendgrid.com"
    },
    {
      "name": "David Tomberlin",
      "email": "david.tomberlin@sendgrid.com"
    },
    {
      "name": "Swift",
      "email": "swift@sendgrid.com"
    },
    {
      "name": "Brandon West",
      "email": "brandon.west@sendgrid.com"
    },
    {
      "name": "Scott Motte",
      "email": "scott.motte@sendgrid.com"
    },
    {
      "name": "Robert Acosta",
      "email": "robert.acosta@sendgrid.com"
    },
    {
      "name": "Elmer Thomas",
      "email": "ethomas@twilio.com"
    },
    {
      "name": "Adam Reis",
      "email": "adam@reis.nz"
    }
  ],
  "dependencies": {
    "@sendgrid/helpers": "^7.3.0",
    "axios": "^0.19.2"
  },
  "deprecated": false,
  "description": "Twilio SendGrid NodeJS API client",
  "devDependencies": {
    "nock": "^10.0.6"
  },
  "engines": {
    "node": "6.* || 8.* || >=10.*"
  },
  "gitHead": "59f6cffc3d45e702ec81212238bae7bf0d704841",
  "homepage": "https://sendgrid.com",
  "license": "MIT",
  "main": "index.js",
  "name": "@sendgrid/client",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/sendgrid/sendgrid-nodejs.git"
  },
  "tags": [
    "http",
    "rest",
    "api",
    "mail",
    "sendgrid"
  ],
  "version": "7.3.0"
}

},{}],4:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';
const axios = require('axios');
const pkg = require('../../package.json');
const {
  helpers: {
    mergeData,
  },
  classes: {
    Response,
    ResponseError,
  },
} = require('@sendgrid/helpers');

const API_KEY_PREFIX = 'SG.';
const SENDGRID_BASE_URL = 'https://api.sendgrid.com/';
const TWILIO_BASE_URL = 'https://email.twilio.com/';

class Client {
  constructor() {
    this.auth = '';
    this.impersonateSubuser = '';

    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'sendgrid/' + pkg.version + ';nodejs',
    };

    this.defaultRequest = {
      baseUrl: SENDGRID_BASE_URL,
      url: '',
      method: 'GET',
      headers: {},
      maxContentLength: Infinity, // Don't limit the content length.
    };
  }

  setApiKey(apiKey) {
    this.auth = 'Bearer ' + apiKey;
    this.setDefaultRequest('baseUrl', SENDGRID_BASE_URL);

    if (!this.isValidApiKey(apiKey)) {
      console.warn(`API key does not start with "${API_KEY_PREFIX}".`);
    }
  }

  setTwilioEmailAuth(username, password) {
    const b64Auth = Buffer.from(username + ':' + password).toString('base64');
    this.auth = 'Basic ' + b64Auth;
    this.setDefaultRequest('baseUrl', TWILIO_BASE_URL);

    if (!this.isValidTwilioAuth(username, password)) {
      console.warn('Twilio Email credentials must be non-empty strings.');
    }
  }

  isValidApiKey(apiKey) {
    return this.isString(apiKey) && apiKey.trim().startsWith(API_KEY_PREFIX);
  }

  isValidTwilioAuth(username, password) {
    return this.isString(username) && username
      && this.isString(password) && password;
  }

  isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  setImpersonateSubuser(subuser) {
    this.impersonateSubuser = subuser;
  }

  setDefaultHeader(key, value) {
    if (key !== null && typeof key === 'object') {
      // key is an object
      Object.assign(this.defaultHeaders, key);
      return this;
    }

    this.defaultHeaders[key] = value;
    return this;
  }

  setDefaultRequest(key, value) {
    if (key !== null && typeof key === 'object') {
      // key is an object
      Object.assign(this.defaultRequest, key);
      return this;
    }

    this.defaultRequest[key] = value;
    return this;
  }

  createHeaders(data) {
    // Merge data with default headers.
    const headers = mergeData(this.defaultHeaders, data);

    // Add auth, but don't overwrite if header already set.
    if (typeof headers.Authorization === 'undefined' && this.auth) {
      headers.Authorization = this.auth;
    }

    if (this.impersonateSubuser) {
      headers['On-Behalf-Of'] = this.impersonateSubuser;
    }

    return headers;
  }

  createRequest(data) {
    let options = {
      url: data.uri || data.url,
      baseUrl: data.baseUrl,
      method: data.method,
      data: data.body,
      params: data.qs,
      headers: data.headers,
    };

    // Merge data with default request.
    options = mergeData(this.defaultRequest, options);
    options.headers = this.createHeaders(options.headers);
    options.baseURL = options.baseUrl;
    delete options.baseUrl;

    return options;
  }

  request(data, cb) {
    data = this.createRequest(data);

    const promise = new Promise((resolve, reject) => {
      axios(data)
        .then(response => {
          return resolve([
            new Response(response.status, response.data, response.headers),
            response.data,
          ]);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status >= 400) {
              return reject(new ResponseError(error.response));
            }
          }
          return reject(error);
        });
    });

    // Throw an error in case a callback function was not passed.
    if (cb && typeof cb !== 'function') {
      throw new Error('Callback passed is not a function.');
    }

    if (cb) {
      return promise
        .then(result => cb(null, result))
        .catch(error => cb(error, null));
    }

    return promise;
  }
}

module.exports = Client;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../../package.json":3,"@sendgrid/helpers":27,"axios":31,"buffer":60}],5:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const Client = require('./classes/client');

//Export singleton instance
module.exports = new Client();

},{"./classes/client":4}],6:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';

/**
 * Dependencies
 */
const toCamelCase = require('../helpers/to-camel-case');
const toSnakeCase = require('../helpers/to-snake-case');
const deepClone = require('../helpers/deep-clone');
const fs = require('fs');
const path = require('path');

/**
 * Attachment class
 */
class Attachment {

  /**
   * Constructor
   */
  constructor(data) {

    //Create from data
    if (data) {
      this.fromData(data);
    }
  }

  /**
   * From data
   */
  fromData(data) {

    //Expecting object
    if (typeof data !== 'object') {
      throw new Error('Expecting object for Mail data');
    }

    //Convert to camel case to make it workable, making a copy to prevent
    //changes to the original objects
    data = deepClone(data);
    data = toCamelCase(data);

    //Extract properties from data
    const {
      content,
      filename,
      type,
      disposition,
      contentId,
      filePath,
    } = data;

    if ((typeof content !== 'undefined') && (typeof filePath !== 'undefined')) {
      throw new Error(
        "The props 'content' and 'filePath' cannot be used together."
      );
    }

    //Set data
    this.setFilename(filename);
    this.setType(type);
    this.setDisposition(disposition);
    this.setContentId(contentId);
    this.setContent(filePath ? this.readFile(filePath) : content);
  }

  /**
   * Read a file and return its content as base64
   */
  readFile(filePath) {
    return fs.readFileSync(path.resolve(filePath));
  }

  /**
   * Set content
   */
  setContent(content) {
    //Duck type check toString on content if it's a Buffer as that's the method that will be called.
    if (typeof content === 'string') {
      this.content = content;
      return;
    } else if (content instanceof Buffer && content.toString !== undefined) {
      this.content = content.toString();

      if (this.disposition === 'attachment') {
        this.content = content.toString('base64');
      }

      return;
    }

    throw new Error('`content` expected to be either Buffer or string');
  }

  /**
   * Set content
   */
  setFileContent(content) {
    if (content instanceof Buffer && content.toString !== undefined) {
      this.content = content.toString('base64');
      return;
    }

    throw new Error('`content` expected to be Buffer');
  }

  /**
   * Set filename
   */
  setFilename(filename) {
    if (typeof filename === 'undefined') {
      return;
    }
    if (filename && typeof filename !== 'string') {
      throw new Error('String expected for `filename`');
    }
    this.filename = filename;
  }

  /**
   * Set type
   */
  setType(type) {
    if (typeof type === 'undefined') {
      return;
    }
    if (typeof type !== 'string') {
      throw new Error('String expected for `type`');
    }
    this.type = type;
  }

  /**
   * Set disposition
   */
  setDisposition(disposition) {
    if (typeof disposition === 'undefined') {
      return;
    }
    if (typeof disposition !== 'string') {
      throw new Error('String expected for `disposition`');
    }
    this.disposition = disposition;
  }

  /**
   * Set content ID
   */
  setContentId(contentId) {
    if (typeof contentId === 'undefined') {
      return;
    }
    if (typeof contentId !== 'string') {
      throw new Error('String expected for `contentId`');
    }
    this.contentId = contentId;
  }

  /**
   * To JSON
   */
  toJSON() {

    //Extract properties from self
    const {content, filename, type, disposition, contentId} = this;

    //Initialize with mandatory properties
    const json = {content, filename};

    //Add whatever else we have
    if (typeof type !== 'undefined') {
      json.type = type;
    }
    if (typeof disposition !== 'undefined') {
      json.disposition = disposition;
    }
    if (typeof contentId !== 'undefined') {
      json.contentId = contentId;
    }

    //Return
    return toSnakeCase(json);
  }
}

//Export class
module.exports = Attachment;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../helpers/deep-clone":17,"../helpers/to-camel-case":23,"../helpers/to-snake-case":24,"buffer":60,"fs":58,"path":62}],7:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const splitNameEmail = require('../helpers/split-name-email');

/**
 * Email address class
 */
class EmailAddress {

  /**
	 * Constructor
	 */
  constructor(data) {

    //Construct from data
    if (data) {
      this.fromData(data);
    }
  }

  /**
   * From data
   */
  fromData(data) {

    //String given
    if (typeof data === 'string') {
      const [name, email] = splitNameEmail(data);
      data = {name, email};
    }

    //Expecting object
    if (typeof data !== 'object') {
      throw new Error('Expecting object or string for EmailAddress data');
    }

    //Extract name and email
    const {name, email} = data;

    //Set
    this.setEmail(email);
    this.setName(name);
  }

  /**
   * Set name
   */
  setName(name) {
    if (typeof name === 'undefined') {
      return;
    }
    if (typeof name !== 'string') {
      throw new Error('String expected for `name`');
    }
    this.name = name;
  }

  /**
   * Set email (mandatory)
   */
  setEmail(email) {
    if (typeof email === 'undefined') {
      throw new Error('Must provide `email`');
    }
    if (typeof email !== 'string') {
      throw new Error('String expected for `email`');
    }
    this.email = email;
  }

  /**
	 * To JSON
	 */
  toJSON() {

    //Get properties
    const {email, name} = this;

    //Initialize with mandatory properties
    const json = {email};

    //Add name if present
    if (name !== '') {
      json.name = name;
    }

    //Return
    return json;
  }

  /**************************************************************************
   * Static helpers
   ***/

  /**
   * Create an EmailAddress instance from given data
   */
  static create(data) {

    //Array?
    if (Array.isArray(data)) {
      return data
        .filter(item => !!item)
        .map(item => this.create(item));
    }

    //Already instance of EmailAddress class?
    if (data instanceof EmailAddress) {
      return data;
    }

    //Create instance
    return new EmailAddress(data);
  }
}

//Export class
module.exports = EmailAddress;

},{"../helpers/split-name-email":20}],8:[function(require,module,exports){
'use strict';

/**
 * Expose classes
 */
const Attachment = require('./attachment');
const EmailAddress = require('./email-address');
const Mail = require('./mail');
const Personalization = require('./personalization');
const Response = require('./response');
const ResponseError = require('./response-error');
const Statistics = require('./statistics');

/**
 * Export
 */
module.exports = {
  Attachment,
  EmailAddress,
  Mail,
  Personalization,
  Response,
  ResponseError,
  Statistics,
};

},{"./attachment":6,"./email-address":7,"./mail":9,"./personalization":10,"./response":12,"./response-error":11,"./statistics":13}],9:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const EmailAddress = require('./email-address');
const Personalization = require('./personalization');
const toCamelCase = require('../helpers/to-camel-case');
const toSnakeCase = require('../helpers/to-snake-case');
const deepClone = require('../helpers/deep-clone');
const arrayToJSON = require('../helpers/array-to-json');
const { DYNAMIC_TEMPLATE_CHAR_WARNING } = require('../constants');
const {validateMailSettings, validateTrackingSettings} = require('../helpers/validate-settings');

/**
 * Mail class
 */
class Mail {

  /**
   * Constructor
   */
  constructor(data) {

    //Initialize array and object properties
    this.isDynamic = false;
    this.hideWarnings = false;
    this.personalizations = [];
    this.attachments = [];
    this.content = [];
    this.categories = [];
    this.headers = {};
    this.sections = {};
    this.customArgs = {};
    this.trackingSettings = {};
    this.mailSettings = {};
    this.asm = {};

    //Helper properties
    this.substitutions = null;
    this.substitutionWrappers = null;
    this.dynamicTemplateData = null;

    //Process data if given
    if (data) {
      this.fromData(data);
    }
  }

  /**
   * Build from data
   */
  fromData(data) {

    //Expecting object
    if (typeof data !== 'object') {
      throw new Error('Expecting object for Mail data');
    }

    //Convert to camel case to make it workable, making a copy to prevent
    //changes to the original objects
    data = deepClone(data);
    data = toCamelCase(data, ['substitutions', 'dynamicTemplateData', 'customArgs', 'headers', 'sections']);

    //Extract properties from data
    const {
      to, from, replyTo, cc, bcc, sendAt, subject, text, html, content,
      templateId, personalizations, attachments, ipPoolName, batchId,
      sections, headers, categories, category, customArgs, asm, mailSettings,
      trackingSettings, substitutions, substitutionWrappers, dynamicTemplateData, isMultiple,
      hideWarnings,
    } = data;

    //Set data
    this.setFrom(from);
    this.setReplyTo(replyTo);
    this.setSubject(subject);
    this.setSendAt(sendAt);
    this.setTemplateId(templateId);
    this.setBatchId(batchId);
    this.setIpPoolName(ipPoolName);
    this.setAttachments(attachments);
    this.setContent(content);
    this.setSections(sections);
    this.setHeaders(headers);
    this.setCategories(category);
    this.setCategories(categories);
    this.setCustomArgs(customArgs);
    this.setAsm(asm);
    this.setMailSettings(mailSettings);
    this.setTrackingSettings(trackingSettings);
    this.setHideWarnings(hideWarnings);

    if (this.isDynamic) {
      this.setDynamicTemplateData(dynamicTemplateData);
    } else {
      this.setSubstitutions(substitutions);
      this.setSubstitutionWrappers(substitutionWrappers);
    }

    //Add contents from text/html properties
    this.addTextContent(text);
    this.addHtmlContent(html);

    //Using "to" property for personalizations
    if (personalizations) {
      this.setPersonalizations(personalizations);
    } else if (isMultiple && Array.isArray(to)) {
      //Multiple individual emails
      to.forEach(to => this.addTo(to, cc, bcc));
    } else {
      //Single email (possibly with multiple recipients in the to field)
      this.addTo(to, cc, bcc);
    }
  }

  /**
   * Set from email
   */
  setFrom(from) {
    if (typeof from === 'undefined') {
      return;
    }
    if (typeof from !== 'string' && typeof from.email !== 'string') {
      throw new Error('String or address object expected for `from`');
    }
    this.from = EmailAddress.create(from);
  }

  /**
   * Set reply to
   */
  setReplyTo(replyTo) {
    if (typeof replyTo === 'undefined') {
      return;
    }
    if (typeof replyTo !== 'string' && typeof replyTo.email !== 'string') {
      throw new Error('String or address object expected for `replyTo`');
    }
    this.replyTo = EmailAddress.create(replyTo);
  }

  /**
   * Set subject
   */
  setSubject(subject) {
    if (typeof subject === 'undefined') {
      return;
    }
    if (typeof subject !== 'string') {
      throw new Error('String expected for `subject`');
    }
    this.subject = subject;
  }

  /**
   * Set send at
   */
  setSendAt(sendAt) {
    if (typeof sendAt === 'undefined') {
      return;
    }
    if (!Number.isInteger(sendAt)) {
      throw new Error('Integer expected for `sendAt`');
    }
    this.sendAt = sendAt;
  }

  /**
   * Set template ID, also checks if the template is dynamic or legacy
   */
  setTemplateId(templateId) {
    if (typeof templateId === 'undefined') {
      return;
    }
    if (typeof templateId !== 'string') {
      throw new Error('String expected for `templateId`');
    }

    if (templateId.indexOf('d-') === 0) {
      this.isDynamic = true;
    }

    this.templateId = templateId;
  }

  /**
   * Set batch ID
   */
  setBatchId(batchId) {
    if (typeof batchId === 'undefined') {
      return;
    }
    if (typeof batchId !== 'string') {
      throw new Error('String expected for `batchId`');
    }
    this.batchId = batchId;
  }

  /**
   * Set IP pool name
   */
  setIpPoolName(ipPoolName) {
    if (typeof ipPoolName === 'undefined') {
      return;
    }
    if (typeof ipPoolName !== 'string') {
      throw new Error('String expected for `ipPoolName`');
    }
    this.ipPoolName = ipPoolName;
  }

  /**
   * Set ASM
   */
  setAsm(asm) {
    if (typeof asm === 'undefined') {
      return;
    }
    if (typeof asm !== 'object') {
      throw new Error('Object expected for `asm`');
    }
    if (typeof asm.groupId !== 'number') {
      throw new Error('Expected `asm` to include an integer in its `groupId` field');
    }
    if (asm.groupsToDisplay &&
      (!Array.isArray(asm.groupsToDisplay) || !asm.groupsToDisplay.every(group => typeof group === 'number'))) {
      throw new Error('Array of integers expected for `asm.groupsToDisplay`');
    }
    this.asm = asm;
  }

  /**
   * Set personalizations
   */
  setPersonalizations(personalizations) {
    if (typeof personalizations === 'undefined') {
      return;
    }
    if (!Array.isArray(personalizations) ||
      !personalizations.every(personalization => typeof personalization === 'object')) {
      throw new Error('Array of objects expected for `personalizations`');
    }

    //Clear and use add helper to add one by one
    this.personalizations = [];
    personalizations
      .forEach(personalization => this.addPersonalization(personalization));
  }

  /**
   * Add personalization
   */
  addPersonalization(personalization) {

    //We should either send substitutions or dynamicTemplateData
    //depending on the templateId
    if (this.isDynamic && personalization.substitutions) {
      delete personalization.substitutions;
    } else if (!this.isDynamic && personalization.dynamicTemplateData) {
      delete personalization.dynamicTemplateData;
    }

    //Convert to class if needed
    if (!(personalization instanceof Personalization)) {
      personalization = new Personalization(personalization);
    }

    //If this is dynamic, set dynamicTemplateData, or set substitutions
    if (this.isDynamic) {
      this.applyDynamicTemplateData(personalization);
    } else {
      this.applySubstitutions(personalization);
    }

    //Push personalization to array
    this.personalizations.push(personalization);
  }

  /**
   * Convenience method for quickly creating personalizations
   */
  addTo(to, cc, bcc) {
    if (
      typeof to === 'undefined' &&
      typeof cc === 'undefined' &&
      typeof bcc === 'undefined'
    ) {
      throw new Error('Provide at least one of to, cc or bcc');
    }
    this.addPersonalization(new Personalization({to, cc, bcc}));
  }

  /**
   * Set substitutions
   */
  setSubstitutions(substitutions) {
    if (typeof substitutions === 'undefined') {
      return;
    }
    if (typeof substitutions !== 'object') {
      throw new Error('Object expected for `substitutions`');
    }
    this.substitutions = substitutions;
  }

  /**
   * Set substitution wrappers
   */
  setSubstitutionWrappers(wrappers) {
    if (typeof wrappers === 'undefined') {
      return;
    }
    if (!Array.isArray(wrappers) || wrappers.length !== 2) {
      throw new Error(
        'Array expected with two elements for `substitutionWrappers`'
      );
    }
    this.substitutionWrappers = wrappers;
  }

  /**
   * Helper which applies globally set substitutions to personalizations
   */
  applySubstitutions(personalization) {
    if (personalization instanceof Personalization) {
      personalization.reverseMergeSubstitutions(this.substitutions);
      personalization.setSubstitutionWrappers(this.substitutionWrappers);
    }
  }

  /**
   * Helper which applies globally set dynamic_template_data to personalizations
   */
  applyDynamicTemplateData(personalization) {
    if (personalization instanceof Personalization) {
      personalization.deepMergeDynamicTemplateData(this.dynamicTemplateData);
    }
  }

  /**
   * Set dynamicTemplateData
   */
  setDynamicTemplateData(dynamicTemplateData) {
    if (typeof dynamicTemplateData === 'undefined') {
      return;
    }
    if (typeof dynamicTemplateData !== 'object') {
      throw new Error('Object expected for `dynamicTemplateData`');
    }

    // Check dynamic template for non-escaped characters and warn if found
    if (!this.hideWarnings) {
      Object.values(dynamicTemplateData).forEach(value => {
        if (/['"&]/.test(value)) {
          console.warn(DYNAMIC_TEMPLATE_CHAR_WARNING);
        }
      });
    }

    this.dynamicTemplateData = dynamicTemplateData;
  }

  /**
   * Set content
   */
  setContent(content) {
    if (typeof content === 'undefined') {
      return;
    }
    if (!Array.isArray(content)) {
      throw new Error('Array expected for `content`');
    }
    if (!content.every(contentField => typeof contentField === 'object')) {
      throw new Error('Expected each entry in `content` to be an object');
    }
    if (!content.every(contentField => typeof contentField.type === 'string')) {
      throw new Error('Expected each `content` entry to contain a `type` string');
    }
    if (!content.every(contentField => typeof contentField.value === 'string')) {
      throw new Error('Expected each `content` entry to contain a `value` string');
    }
    this.content = content;
  }

  /**
   * Add content
   */
  addContent(content) {
    if (typeof content !== 'object') {
      throw new Error('Object expected for `content`');
    }
    this.content.push(content);
  }

  /**
   * Add text content
   */
  addTextContent(text) {
    if (typeof text === 'undefined') {
      return;
    }
    if (typeof text !== 'string') {
      throw new Error('String expected for `text`');
    }
    this.addContent({
      value: text,
      type: 'text/plain',
    });
  }

  /**
   * Add HTML content
   */
  addHtmlContent(html) {
    if (typeof html === 'undefined') {
      return;
    }
    if (typeof html !== 'string') {
      throw new Error('String expected for `html`');
    }
    this.addContent({
      value: html,
      type: 'text/html',
    });
  }

  /**
   * Set attachments
   */
  setAttachments(attachments) {
    if (typeof attachments === 'undefined') {
      return;
    }
    if (!Array.isArray(attachments)) {
      throw new Error('Array expected for `attachments`');
    }
    if (!attachments.every(attachment => typeof attachment.content === 'string')) {
      throw new Error('Expected each attachment to contain a `content` string');
    }
    if (!attachments.every(attachment => typeof attachment.filename === 'string')) {
      throw new Error('Expected each attachment to contain a `filename` string');
    }
    if (!attachments.every(attachment => !attachment.type || typeof attachment.type === 'string')) {
      throw new Error('Expected the attachment\'s `type` field to be a string');
    }
    if (!attachments.every(attachment => !attachment.disposition || typeof attachment.disposition === 'string')) {
      throw new Error('Expected the attachment\'s `disposition` field to be a string');
    }
    this.attachments = attachments;
  }

  /**
   * Add attachment
   */
  addAttachment(attachment) {
    if (typeof attachment !== 'object') {
      throw new Error('Object expected for `attachment`');
    }
    this.attachments.push(attachment);
  }

  /**
   * Set categories
   */
  setCategories(categories) {
    if (typeof categories === 'undefined') {
      return;
    }
    if (typeof categories === 'string') {
      categories = [categories];
    }
    if (!Array.isArray(categories) ||
      !categories.every(cat => typeof cat === 'string')) {
      throw new Error('Array of strings expected for `categories`');
    }
    this.categories = categories;
  }

  /**
   * Add category
   */
  addCategory(category) {
    if (typeof category !== 'string') {
      throw new Error('String expected for `category`');
    }
    this.categories.push(category);
  }

  /**
   * Set headers
   */
  setHeaders(headers) {
    if (typeof headers === 'undefined') {
      return;
    }
    if (typeof headers !== 'object') {
      throw new Error('Object expected for `headers`');
    }
    this.headers = headers;
  }

  /**
   * Add a header
   */
  addHeader(key, value) {
    if (typeof key !== 'string') {
      throw new Error('String expected for header key');
    }
    if (typeof value !== 'string') {
      throw new Error('String expected for header value');
    }
    this.headers[key] = value;
  }

  /**
   * Set sections
   */
  setSections(sections) {
    if (typeof sections === 'undefined') {
      return;
    }
    if (typeof sections !== 'object') {
      throw new Error('Object expected for `sections`');
    }
    this.sections = sections;
  }

  /**
   * Set custom args
   */
  setCustomArgs(customArgs) {
    if (typeof customArgs === 'undefined') {
      return;
    }
    if (typeof customArgs !== 'object') {
      throw new Error('Object expected for `customArgs`');
    }
    this.customArgs = customArgs;
  }

  /**
   * Set tracking settings
   */
  setTrackingSettings(settings) {
    if (typeof settings === 'undefined') {
      return;
    }
    validateTrackingSettings(settings);
    this.trackingSettings = settings;
  }

  /**
   * Set mail settings
   */
  setMailSettings(settings) {
    if (typeof settings === 'undefined') {
      return;
    }
    validateMailSettings(settings);
    this.mailSettings = settings;
  }

  /**
   * Set hide warnings
   */
  setHideWarnings(hide) {
    if (typeof hide === 'undefined') {
      return;
    }
    if (typeof hide !== 'boolean') {
      throw new Error('Boolean expected for `hideWarnings`');
    }
    this.hideWarnings = hide;
  }

  /**
   * To JSON
   */
  toJSON() {

    //Extract properties from self
    const {
      from, replyTo, sendAt, subject, content, templateId,
      personalizations, attachments, ipPoolName, batchId, asm,
      sections, headers, categories, customArgs, mailSettings,
      trackingSettings,
    } = this;

    //Initialize with mandatory values
    const json = {
      from, subject,
      personalizations: arrayToJSON(personalizations),
    };

    //Array properties
    if (Array.isArray(attachments) && attachments.length > 0) {
      json.attachments = arrayToJSON(attachments);
    }
    if (Array.isArray(categories) && categories.length > 0) {
      json.categories = categories.filter(cat => cat !== '');
    }
    if (Array.isArray(content) && content.length > 0) {
      json.content = arrayToJSON(content);
    }

    //Object properties
    if (Object.keys(headers).length > 0) {
      json.headers = headers;
    }
    if (Object.keys(mailSettings).length > 0) {
      json.mailSettings = mailSettings;
    }
    if (Object.keys(trackingSettings).length > 0) {
      json.trackingSettings = trackingSettings;
    }
    if (Object.keys(customArgs).length > 0) {
      json.customArgs = customArgs;
    }
    if (Object.keys(sections).length > 0) {
      json.sections = sections;
    }
    if (Object.keys(asm).length > 0) {
      json.asm = asm;
    }

    //Simple properties
    if (typeof replyTo !== 'undefined') {
      json.replyTo = replyTo;
    }
    if (typeof sendAt !== 'undefined') {
      json.sendAt = sendAt;
    }
    if (typeof batchId !== 'undefined') {
      json.batchId = batchId;
    }
    if (typeof templateId !== 'undefined') {
      json.templateId = templateId;
    }
    if (typeof ipPoolName !== 'undefined') {
      json.ipPoolName = ipPoolName;
    }

    //Return as snake cased object
    return toSnakeCase(json, ['substitutions', 'dynamicTemplateData', 'customArgs', 'headers', 'sections']);
  }

  /**************************************************************************
   * Static helpers
   ***/

  /**
   * Create a Mail instance from given data
   */
  static create(data) {

    //Array?
    if (Array.isArray(data)) {
      return data
        .filter(item => !!item)
        .map(item => this.create(item));
    }

    //Already instance of Mail class?
    if (data instanceof Mail) {
      return data;
    }

    //Create instance
    return new Mail(data);
  }
}

//Export class
module.exports = Mail;

},{"../constants":14,"../helpers/array-to-json":15,"../helpers/deep-clone":17,"../helpers/to-camel-case":23,"../helpers/to-snake-case":24,"../helpers/validate-settings":25,"./email-address":7,"./personalization":10}],10:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const EmailAddress = require('./email-address');
const toCamelCase = require('../helpers/to-camel-case');
const toSnakeCase = require('../helpers/to-snake-case');
const deepClone = require('../helpers/deep-clone');
const deepMerge = require('deepmerge');
const wrapSubstitutions = require('../helpers/wrap-substitutions');

/**
 * Personalization class
 */
class Personalization {

  /**
   * Constructor
   */
  constructor(data) {

    //Init array and object placeholders
    this.to = [];
    this.cc = [];
    this.bcc = [];
    this.headers = {};
    this.customArgs = {};
    this.substitutions = {};
    this.substitutionWrappers = ['{{', '}}'];
    this.dynamicTemplateData = {};

    //Build from data if given
    if (data) {
      this.fromData(data);
    }
  }

  /**
   * From data
   */
  fromData(data) {

    //Expecting object
    if (typeof data !== 'object') {
      throw new Error('Expecting object for Mail data');
    }

    //Convert to camel case to make it workable, making a copy to prevent
    //changes to the original objects
    data = deepClone(data);
    data = toCamelCase(data, ['substitutions', 'dynamicTemplateData', 'customArgs', 'headers']);

    //Extract properties from data
    const {
      to, cc, bcc, subject, headers, customArgs, sendAt,
      substitutions, substitutionWrappers, dynamicTemplateData,
    } = data;

    //Set data
    this.setTo(to);
    this.setCc(cc);
    this.setBcc(bcc);
    this.setSubject(subject);
    this.setHeaders(headers);
    this.setSubstitutions(substitutions);
    this.setSubstitutionWrappers(substitutionWrappers);
    this.setCustomArgs(customArgs);
    this.setDynamicTemplateData(dynamicTemplateData);
    this.setSendAt(sendAt);
  }

  /**
   * Set subject
   */
  setSubject(subject) {
    if (typeof subject === 'undefined') {
      return;
    }
    if (typeof subject !== 'string') {
      throw new Error('String expected for `subject`');
    }
    this.subject = subject;
  }

  /**
   * Set send at
   */
  setSendAt(sendAt) {
    if (typeof sendAt === 'undefined') {
      return;
    }
    if (!Number.isInteger(sendAt)) {
      throw new Error('Integer expected for `sendAt`');
    }
    this.sendAt = sendAt;
  }

  /**
   * Set to
   */
  setTo(to) {
    if (typeof to === 'undefined') {
      return;
    }
    if (!Array.isArray(to)) {
      to = [to];
    }
    this.to = EmailAddress.create(to);
  }

  /**
   * Add a single to
   */
  addTo(to) {
    if (typeof to === 'undefined') {
      return;
    }
    this.to.push(EmailAddress.create(to));
  }

  /**
   * Set cc
   */
  setCc(cc) {
    if (typeof cc === 'undefined') {
      return;
    }
    if (!Array.isArray(cc)) {
      cc = [cc];
    }
    this.cc = EmailAddress.create(cc);
  }

  /**
   * Add a single cc
   */
  addCc(cc) {
    if (typeof cc === 'undefined') {
      return;
    }
    this.cc.push(EmailAddress.create(cc));
  }

  /**
   * Set bcc
   */
  setBcc(bcc) {
    if (typeof bcc === 'undefined') {
      return;
    }
    if (!Array.isArray(bcc)) {
      bcc = [bcc];
    }
    this.bcc = EmailAddress.create(bcc);
  }

  /**
   * Add a single bcc
   */
  addBcc(bcc) {
    if (typeof bcc === 'undefined') {
      return;
    }
    this.bcc.push(EmailAddress.create(bcc));
  }

  /**
   * Set headers
   */
  setHeaders(headers) {
    if (typeof headers === 'undefined') {
      return;
    }
    if (typeof headers !== 'object' || headers === null) {
      throw new Error('Object expected for `headers`');
    }
    this.headers = headers;
  }

  /**
   * Add a header
   */
  addHeader(key, value) {
    if (typeof key !== 'string') {
      throw new Error('String expected for header key');
    }
    if (typeof value !== 'string') {
      throw new Error('String expected for header value');
    }
    this.headers[key] = value;
  }

  /**
   * Set custom args
   */
  setCustomArgs(customArgs) {
    if (typeof customArgs === 'undefined') {
      return;
    }
    if (typeof customArgs !== 'object' || customArgs === null) {
      throw new Error('Object expected for `customArgs`');
    }
    this.customArgs = customArgs;
  }

  /**
   * Add a custom arg
   */
  addCustomArg(key, value) {
    if (typeof key !== 'string') {
      throw new Error('String expected for custom arg key');
    }
    if (typeof value !== 'string') {
      throw new Error('String expected for custom arg value');
    }
    this.customArgs[key] = value;
  }

  /**
   * Set substitutions
   */
  setSubstitutions(substitutions) {
    if (typeof substitutions === 'undefined') {
      return;
    }
    if (typeof substitutions !== 'object') {
      throw new Error('Object expected for `substitutions`');
    }
    this.substitutions = substitutions;
  }

  /**
   * Add a substitution
   */
  addSubstitution(key, value) {
    if (typeof key !== 'string') {
      throw new Error('String expected for substitution key');
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('String or Number expected for substitution value');
    }
    this.substitutions[key] = value;
  }

  /**
   * Reverse merge substitutions, preserving existing ones
   */
  reverseMergeSubstitutions(substitutions) {
    if (typeof substitutions === 'undefined' || substitutions === null) {
      return;
    }
    if (typeof substitutions !== 'object') {
      throw new Error(
        'Object expected for `substitutions` in reverseMergeSubstitutions'
      );
    }
    this.substitutions = Object.assign({}, substitutions, this.substitutions);
  }

  /**
   * Set substitution wrappers
   */
  setSubstitutionWrappers(wrappers) {
    if (typeof wrappers === 'undefined' || wrappers === null) {
      return;
    }

    if (!Array.isArray(wrappers) || wrappers.length !== 2) {
      throw new Error(
        'Array expected with two elements for `substitutionWrappers`'
      );
    }
    this.substitutionWrappers = wrappers;
  }

  /**
   * Reverse merge dynamic template data, preserving existing ones
   */
  deepMergeDynamicTemplateData(dynamicTemplateData) {
    if (typeof dynamicTemplateData === 'undefined' || dynamicTemplateData === null) {
      return;
    }
    if (typeof dynamicTemplateData !== 'object') {
      throw new Error(
        'Object expected for `dynamicTemplateData` in deepMergeDynamicTemplateData'
      );
    }
    this.dynamicTemplateData = deepMerge(dynamicTemplateData, this.dynamicTemplateData);
  }

  /**
   * Set dynamic template data
   */
  setDynamicTemplateData(dynamicTemplateData) {
    if (typeof dynamicTemplateData === 'undefined') {
      return;
    }
    if (typeof dynamicTemplateData !== 'object') {
      throw new Error('Object expected for `dynamicTemplateData`');
    }
    this.dynamicTemplateData = dynamicTemplateData;
  }

  /**
   * To JSON
   */
  toJSON() {

    //Get data from self
    const {
      to, cc, bcc, subject, headers, customArgs, sendAt,
      substitutions, substitutionWrappers, dynamicTemplateData,
    } = this;

    //Initialize with mandatory values
    const json = {to};

    //Arrays
    if (Array.isArray(cc) && cc.length > 0) {
      json.cc = cc;
    }
    if (Array.isArray(bcc) && bcc.length > 0) {
      json.bcc = bcc;
    }

    //Objects
    if (Object.keys(headers).length > 0) {
      json.headers = headers;
    }
    if (substitutions && Object.keys(substitutions).length > 0) {
      const [left, right] = substitutionWrappers;
      json.substitutions = wrapSubstitutions(substitutions, left, right);
    }
    if (Object.keys(customArgs).length > 0) {
      json.customArgs = customArgs;
    }

    if (dynamicTemplateData && Object.keys(dynamicTemplateData).length > 0) {
      json.dynamicTemplateData = dynamicTemplateData;
    }

    //Simple properties
    if (typeof subject !== 'undefined') {
      json.subject = subject;
    }
    if (typeof sendAt !== 'undefined') {
      json.sendAt = sendAt;
    }

    //Return as snake cased object
    return toSnakeCase(json, ['substitutions', 'dynamicTemplateData', 'customArgs', 'headers']);
  }
}

//Export class
module.exports = Personalization;

},{"../helpers/deep-clone":17,"../helpers/to-camel-case":23,"../helpers/to-snake-case":24,"../helpers/wrap-substitutions":26,"./email-address":7,"deepmerge":57}],11:[function(require,module,exports){
(function (process){(function (){
'use strict';

/**
 * Response error class
 */
class ResponseError extends Error {

  /**
   * Constructor
   */
  constructor(response) {

    //Super
    super();

    //Extract data from response
    const { headers, status, statusText, data } = response;

    //Set data
    this.code = status;
    this.message = statusText;
    this.response = { headers, body: data };

    //Capture stack trace
    if (!this.stack) {
      Error.captureStackTrace(this, this.constructor);
    }

    //Clean up stack trace
    const regex = new RegExp(process.cwd() + '/', 'gi');
    this.stack = this.stack.replace(regex, '');
  }

  /**
   * Convert to string
   */
  toString() {
    const { body } = this.response;
    let err = `${this.message} (${this.code})`;
    if (body && Array.isArray(body.errors)) {
      body.errors.forEach(error => {
        const message = error.message;
        const field = error.field;
        const help = error.help;
        err += `\n  ${message}\n    ${field}\n    ${help}`;
      });
    }
    return err;
  }

  /**
   * Convert to simple object for JSON responses
   */
  toJSON() {
    const { message, code, response } = this;
    return { message, code, response };
  }
}

//Export
module.exports = ResponseError;

}).call(this)}).call(this,require('_process'))
},{"_process":63}],12:[function(require,module,exports){
'use strict';

class Response {
  constructor(statusCode, body, headers) {
    this.statusCode = statusCode;
    this.body = body;
    this.headers = headers;
  }

  toString() {
    return 'HTTP ' + this.statusCode + ' ' + this.body;
  }
}

module.exports = Response;

},{}],13:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const toCamelCase = require('../helpers/to-camel-case');
const deepClone = require('../helpers/deep-clone');

/**
 * Options
 */
const AggregatedByOptions = ['day', 'week', 'month'];
const CountryOptions = ['us', 'ca'];
const SortByDirection = ['desc', 'asc'];

/**
 * Statistics class
 */
class Statistics {
  constructor(data) {
    this.startDate = null;
    this.endDate = null;
    this.aggregatedBy = null;

    if (data) {
      this.fromData(data);
    }
  }

  /**
   * Build from data
   */
  fromData(data) {

    //Expecting object
    if (typeof data !== 'object') {
      throw new Error('Expecting object for Statistics data');
    }

    //Convert to camel case to make it workable, making a copy to prevent
    //changes to the original objects
    data = deepClone(data);
    data = toCamelCase(data, ['substitutions', 'customArgs']);

    const { startDate,
      endDate,
      aggregatedBy,
    } = data;

    this.setStartDate(startDate);
    this.setEndDate(endDate);
    this.setAggregatedBy(aggregatedBy);
  }

  /**
   * Set startDate
   */
  setStartDate(startDate) {
    if (typeof startDate === 'undefined') {
      throw new Error('Date expected for `startDate`');
    }

    if ((new Date(startDate) === 'Invalid Date') ||
        isNaN(new Date(startDate))) {
      throw new Error('Date expected for `startDate`');
    }

    console.log(startDate);

    this.startDate = new Date(startDate).toISOString().slice(0, 10);
  }

  /**
   * Set endDate
   */
  setEndDate(endDate) {
    if (typeof endDate === 'undefined') {
      this.endDate = new Date().toISOString().slice(0, 10);
      return;
    }

    if (new Date(endDate) === 'Invalid Date' || isNaN(new Date(endDate))) {
      throw new Error('Date expected for `endDate`');
    }

    this.endDate = new Date(endDate).toISOString().slice(0, 10);
  }

  /**
   * Set aggregatedBy
   */
  setAggregatedBy(aggregatedBy) {
    if (typeof aggregatedBy === 'undefined') {
      return;
    }

    if (typeof aggregatedBy === 'string' &&
        AggregatedByOptions.includes(aggregatedBy.toLowerCase())) {
      this.aggregatedBy = aggregatedBy;
    } else {
      throw new Error('Incorrect value for `aggregatedBy`');
    }
  }

  /**
   * Get Global
   */
  getGlobal() {
    const { startDate, endDate, aggregatedBy } = this;

    return { startDate, endDate, aggregatedBy };
  }

  /**
   * Get Advanced
   */
  getAdvanced(country) {
    const json = this.getGlobal();

    if (typeof country === 'undefined') {
      return json;
    }

    if (typeof country === 'string' &&
        CountryOptions.includes(country.toLowerCase())) {
      json.country = country;
    }

    return json;
  }

  /**
   * Get Advanced Mailbox Providers
   */
  getAdvancedMailboxProviders(mailBoxProviders) {
    const json = this.getGlobal();

    if (typeof mailBoxProviders === 'undefined') {
      return json;
    }

    if (Array.isArray(mailBoxProviders) &&
        mailBoxProviders.some(x => typeof x !== 'string')) {
      throw new Error('Array of strings expected for `mailboxProviders`');
    }

    json.mailBoxProviders = mailBoxProviders;

    return json;
  }

  /**
   * Get Advanced Browsers
   */
  getAdvancedBrowsers(browsers) {
    const json = this.getGlobal();

    if (typeof browsers === 'undefined') {
      return json;
    }

    if (Array.isArray(browsers) && browsers.some(x => typeof x !== 'string')) {
      throw new Error('Array of strings expected for `browsers`');
    }

    json.browsers = browsers;

    return json;
  }

  /**
   * Get Categories
   */
  getCategories(categories) {
    if (typeof categories === 'undefined') {
      throw new Error('Array of strings expected for `categories`');
    }

    if (!this._isValidArrayOfStrings(categories)) {
      throw new Error('Array of strings expected for `categories`');
    }

    const json = this.getGlobal();
    json.categories = categories;

    return json;
  }

  /**
   * Get Subuser
   */
  getSubuser(subusers) {
    if (typeof subusers === 'undefined') {
      throw new Error('Array of strings expected for `subusers`');
    }

    if (!this._isValidArrayOfStrings(subusers)) {
      throw new Error('Array of strings expected for `subusers`');
    }

    const json = this.getGlobal();
    json.subusers = subusers;

    return json;
  }

  /**
   * Get Subuser Sum
   */
  getSubuserSum(sortByMetric = 'delivered',
    sortByDirection = SortByDirection[0], limit = 5, offset = 0) {
    if (typeof sortByMetric !== 'string') {
      throw new Error('string expected for `sortByMetric`');
    }

    if (!SortByDirection.includes(sortByDirection.toLowerCase())) {
      throw new Error('desc or asc expected for `sortByDirection`');
    }

    if (typeof limit !== 'number') {
      throw new Error('number expected for `limit`');
    }

    if (typeof offset !== 'number') {
      throw new Error('number expected for `offset`');
    }

    const json = this.getGlobal();

    json.sortByMetric = sortByMetric;
    json.sortByDirection = sortByDirection;
    json.limit = limit;
    json.offset = offset;

    return json;
  }

  /**
   * Get Subuser Monthly
   */
  getSubuserMonthly(sortByMetric = 'delivered',
    sortByDirection = SortByDirection[0], limit = 5, offset = 0) {
    if (typeof sortByMetric !== 'string') {
      throw new Error('string expected for `sortByMetric`');
    }

    if (!SortByDirection.includes(sortByDirection.toLowerCase())) {
      throw new Error('desc or asc expected for `sortByDirection`');
    }

    if (typeof limit !== 'number') {
      throw new Error('number expected for `limit`');
    }

    if (typeof offset !== 'number') {
      throw new Error('number expected for `offset`');
    }

    const json = this.getGlobal();

    json.sortByMetric = sortByMetric;
    json.sortByDirection = sortByDirection;
    json.limit = limit;
    json.offset = offset;

    return json;
  }

  _isValidArrayOfStrings(arr) {
    if (!Array.isArray(arr)) {
      return false;
    }

    if (arr.length < 1 || arr.some(x => typeof x !== 'string')) {
      return false;
    }

    return true;
  }
}

//Export class
module.exports = Statistics;

},{"../helpers/deep-clone":17,"../helpers/to-camel-case":23}],14:[function(require,module,exports){
const DYNAMIC_TEMPLATE_CHAR_WARNING = `
Content with characters ', " or & may need to be escaped with three brackets
{{{ content }}}
See https://sendgrid.com/docs/for-developers/sending-email/using-handlebars/ for more information.`;

module.exports = {
  DYNAMIC_TEMPLATE_CHAR_WARNING,
};

},{}],15:[function(require,module,exports){
'use strict';

/**
 * Helper to convert an array of objects to JSON
 */
module.exports = function arrayToJSON(arr) {
  return arr.map(item => {
    if (typeof item === 'object' && item !== null && typeof item.toJSON === 'function') {
      return item.toJSON();
    }
    return item;
  });
};

},{}],16:[function(require,module,exports){
'use strict';

/**
 * Helper to convert an object's keys
 */
module.exports = function convertKeys(obj, converter, ignored) {

  //Validate
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Non object passed to convertKeys: ' + obj);
  }

  //Ignore arrays
  if (Array.isArray(obj)) {
    return obj;
  }

  //Ensure array for ignored values
  if (!Array.isArray(ignored)) {
    ignored = [];
  }

  //Process all properties
  for (const key in obj) {
    //istanbul ignore else
    if (obj.hasOwnProperty(key)) {

      //Convert key to snake case
      const converted = converter(key);

      //Recursive for child objects, unless ignored
      //The ignored check checks both variants of the key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (!ignored.includes(key) && !ignored.includes(converted)) {
          obj[key] = convertKeys(obj[key], converter, ignored);
        }
      }

      //Convert key to snake case and set if needed
      if (converted !== key) {
        obj[converted] = obj[key];
        delete obj[key];
      }
    }
  }

  //Return object
  return obj;
};

},{}],17:[function(require,module,exports){
'use strict';

/**
 * Deep cloning helper for objects
 */
module.exports = function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
};

},{}],18:[function(require,module,exports){
'use strict';

/**
 * Expose helpers
 */
const arrayToJSON = require('./array-to-json');
const convertKeys = require('./convert-keys');
const deepClone = require('./deep-clone');
const mergeData = require('./merge-data');
const splitNameEmail = require('./split-name-email');
const toCamelCase = require('./to-camel-case');
const toSnakeCase = require('./to-snake-case');
const wrapSubstitutions = require('./wrap-substitutions');

/**
 * Export
 */
module.exports = {
  arrayToJSON,
  convertKeys,
  deepClone,
  mergeData,
  splitNameEmail,
  toCamelCase,
  toSnakeCase,
  wrapSubstitutions,
};

},{"./array-to-json":15,"./convert-keys":16,"./deep-clone":17,"./merge-data":19,"./split-name-email":20,"./to-camel-case":23,"./to-snake-case":24,"./wrap-substitutions":26}],19:[function(require,module,exports){
'use strict';

/**
 * Merge data helper
 */
module.exports = function mergeData(base, data) {

  //Validate data
  if (typeof base !== 'object' || base === null) {
    throw new Error('Not an object provided for base');
  }
  if (typeof data !== 'object' || data === null) {
    throw new Error('Not an object provided for data');
  }

  //Copy base
  const merged = Object.assign({}, base);

  //Add data
  for (const key in data) {
    //istanbul ignore else
    if (data.hasOwnProperty(key)) {
      if (data[key] && Array.isArray(data[key])) {
        merged[key] = data[key];
      } else if (data[key] && typeof data[key] === 'object') {
        merged[key] = Object.assign({}, data[key]);
      } else if (data[key]) {
        merged[key] = data[key];
      }
    }
  }

  //Return
  return merged;
};

},{}],20:[function(require,module,exports){
'use strict';

/**
 * Split name and email address from string
 */
module.exports = function splitNameEmail(str) {

  //If no email bracket present, return as is
  if (str.indexOf('<') === -1) {
    return ['', str];
  }

  //Split into name and email
  let [name, email] = str.split('<');

  //Trim and fix up
  name = name.trim();
  email = email.replace('>', '').trim();

  //Return as array
  return [name, email];
};

},{}],21:[function(require,module,exports){
'use strict';

/**
 * Internal conversion helper
 */
module.exports = function strToCamelCase(str) {
  if (typeof str !== 'string') {
    throw new Error('String expected for conversion to snake case');
  }
  return str
    .trim()
    .replace(/_+|\-+/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (Number(match) === 0) {
        return '';
      }
      return (index === 0) ? match.toLowerCase() : match.toUpperCase();
    });
};

},{}],22:[function(require,module,exports){
'use strict';

/**
 * Internal conversion helper
 */
module.exports = function strToSnakeCase(str) {
  if (typeof str !== 'string') {
    throw new Error('String expected for conversion to snake case');
  }
  return str.trim().replace(/(\s*\-*\b\w|[A-Z])/g, function($1) {
    $1 = $1.trim().toLowerCase().replace('-', '');
    return ($1[0] === '_' ? '' : '_') + $1;
  }).slice(1);
};

},{}],23:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const convertKeys = require('./convert-keys');
const strToCamelCase = require('./str-to-camel-case');

/**
 * Convert object keys to camel case
 */
module.exports = function toCamelCase(obj, ignored) {
  return convertKeys(obj, strToCamelCase, ignored);
};

},{"./convert-keys":16,"./str-to-camel-case":21}],24:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const convertKeys = require('./convert-keys');
const strToSnakeCase = require('./str-to-snake-case');

/**
 * Convert object keys to snake case
 */
module.exports = function toSnakeCase(obj, ignored) {
  return convertKeys(obj, strToSnakeCase, ignored);
};

},{"./convert-keys":16,"./str-to-snake-case":22}],25:[function(require,module,exports){
'use strict';

const validate = (parent, parentName, childName, childType) => {
  if (typeof parent === 'undefined' || typeof parent[childName] === 'undefined') {
    return;
  }
  if (typeof parent[childName] !== childType) {
    throw new Error(`${childType} expected for \`${parentName}.${childName}\``)
  }
};

module.exports = {
  validateMailSettings(settings) {
    if (typeof settings !== 'object') {
      throw new Error('Object expected for `mailSettings`');
    }
    const {
      bcc,
      bypassListManagement,
      footer,
      sandboxMode,
      spamCheck,
    } = settings;
    validate(bcc, 'bcc', 'enable', 'boolean');
    validate(bcc, 'bcc', 'email', 'string');
    validate(bypassListManagement, 'bypassListManagement', 'enable', 'boolean');
    validate(footer, 'footer', 'enable', 'boolean');
    validate(footer, 'footer', 'text', 'string');
    validate(footer, 'footer', 'html', 'string');
    validate(sandboxMode, 'sandboxMode', 'enable', 'boolean');
    validate(spamCheck, 'spamCheck', 'enable', 'boolean');
    validate(spamCheck, 'spamCheck', 'threshold', 'number');
    validate(spamCheck, 'spamCheck', 'postToUrl', 'string');
  },

  validateTrackingSettings(settings) {
    if (typeof settings !== 'object') {
      throw new Error('Object expected for `trackingSettings`');
    }
    const {
      clickTracking,
      openTracking,
      subscriptionTracking,
      ganalytics,
    } = settings;
    validate(clickTracking, 'clickTracking', 'enable', 'boolean');
    validate(clickTracking, 'clickTracking', 'enableText', 'boolean');
    validate(openTracking, 'openTracking', 'enable', 'boolean');
    validate(openTracking, 'openTracking', 'substitutionTag', 'string');
    validate(subscriptionTracking, 'subscriptionTracking', 'enable', 'boolean');
    validate(subscriptionTracking, 'subscriptionTracking', 'text', 'string');
    validate(subscriptionTracking, 'subscriptionTracking', 'html', 'string');
    validate(subscriptionTracking, 'subscriptionTracking', 'substitutionTag', 'string');
    validate(ganalytics, 'ganalytics', 'enable', 'boolean');
    validate(ganalytics, 'ganalytics', 'utm_source', 'string');
    validate(ganalytics, 'ganalytics', 'utm_medium', 'string');
    validate(ganalytics, 'ganalytics', 'utm_term', 'string');
    validate(ganalytics, 'ganalytics', 'utm_content', 'string');
    validate(ganalytics, 'ganalytics', 'utm_campaign', 'string');
  },
};

},{}],26:[function(require,module,exports){
'use strict';

/**
 * Wrap substitutions
 */
module.exports = function wrap(substitutions, left = '{{', right = '}}') {

  //Process arrays
  if (Array.isArray(substitutions)) {
    return substitutions.map(subs => wrap(subs, left, right));
  }

  //Initialize new wrapped object
  const wrapped = {};

  //Map substitutions and ensure string for value
  for (const key in substitutions) {
    //istanbul ignore else
    if (substitutions.hasOwnProperty(key)) {
      wrapped[left + key + right] = String(substitutions[key]);
    }
  }

  //Return wrapped substitutions
  return wrapped;
};

},{}],27:[function(require,module,exports){
'use strict';

/**
 * Load support assets
 */
const classes = require('./classes');
const helpers = require('./helpers');

/**
 * Export
 */
module.exports = {classes, helpers};

},{"./classes":8,"./helpers":18}],28:[function(require,module,exports){
'use strict';

const mailer = require('./src/mail');
const MailService = require('./src/classes/mail-service');

module.exports = mailer;
module.exports.MailService = MailService;

},{"./src/classes/mail-service":29,"./src/mail":30}],29:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const {Client} = require('@sendgrid/client');
const {classes: {Mail}} = require('@sendgrid/helpers');

/**
 * Mail service class
 */
class MailService {

  /**
   * Constructor
   */
  constructor() {

    // Set client, initialize substitution wrappers and secret rules filter.
    this.setClient(new Client());
    this.setSubstitutionWrappers('{{', '}}');
    this.secretRules = [];
  }

  /**
   * Set client
   */
  setClient(client) {
    this.client = client;
  }

  /**
   * SendGrid API key passthrough for convenience.
   */
  setApiKey(apiKey) {
    this.client.setApiKey(apiKey);
  }

  /**
   * Twilio Email Auth passthrough for convenience.
   */
  setTwilioEmailAuth(username, password) {
    this.client.setTwilioEmailAuth(username, password);
  }

  /**
   * Set client timeout
   */
  setTimeout(timeout) {
    if (typeof timeout === 'undefined') {
      return;
    }

    this.client.setDefaultRequest('timeout', timeout);
  }

  /**
   * Set substitution wrappers
   */
  setSubstitutionWrappers(left, right) {
    if (typeof left === 'undefined' || typeof right === 'undefined') {
      throw new Error('Must provide both left and right side wrappers');
    }
    if (!Array.isArray(this.substitutionWrappers)) {
      this.substitutionWrappers = [];
    }
    this.substitutionWrappers[0] = left;
    this.substitutionWrappers[1] = right;
  }

  /**
   * Set secret rules for filtering the e-mail content
   */
  setSecretRules(rules) {
    if (!(rules instanceof Array)) {
      rules = [rules];
    }

    const tmpRules = rules.map(function (rule) {
      const ruleType = typeof rule;

      if (ruleType === 'string') {
        return {
          pattern: new RegExp(rule),
        };
      } else if (ruleType === 'object') {
        // normalize rule object
        if (rule instanceof RegExp) {
          rule = {
            pattern: rule,
          };
        } else if (rule.hasOwnProperty('pattern')
          && (typeof rule.pattern === 'string')
        ) {
          rule.pattern = new RegExp(rule.pattern);
        }

        try {
          // test if rule.pattern is a valid regex
          rule.pattern.test('');
          return rule;
        } catch (err) {
          // continue regardless of error
        }
      }
    });

    this.secretRules = tmpRules.filter(function (val) {
      return val;
    });
  }

  /**
   * Check if the e-mail is safe to be sent
   */
  filterSecrets(body) {
    if ((typeof body === 'object') && !body.hasOwnProperty('content')) {
      return;
    }

    const self = this;

    body.content.forEach(function (data) {
      self.secretRules.forEach(function (rule) {
        if (rule.hasOwnProperty('pattern')
          && !rule.pattern.test(data.value)
        ) {
          return;
        }

        let message = `The pattern '${rule.pattern}'`;

        if (rule.name) {
          message += `identified by '${rule.name}'`;
        }

        message += ' was found in the Mail content!';

        throw new Error(message);
      });
    });
  }

  /**
   * Send email
   */
  send(data, isMultiple = false, cb) {

    //Callback as second parameter
    if (typeof isMultiple === 'function') {
      cb = isMultiple;
      isMultiple = false;
    }

    //Array? Send in parallel
    if (Array.isArray(data)) {

      //Create promise
      const promise = Promise.all(data.map(item => {
        return this.send(item, isMultiple);
      }));

      //Execute callback if provided
      if (cb) {
        promise
          .then(result => cb(null, result))
          .catch(error => cb(error, null));
      }

      //Return promise
      return promise;
    }

    //Send mail
    try {

      //Append multiple flag to data if not set
      if (typeof data.isMultiple === 'undefined') {
        data.isMultiple = isMultiple;
      }

      //Append global substitution wrappers if not set in data
      if (typeof data.substitutionWrappers === 'undefined') {
        data.substitutionWrappers = this.substitutionWrappers;
      }

      //Create Mail instance from data and get JSON body for request
      const mail = Mail.create(data);
      const body = mail.toJSON();

      //Filters the Mail body to avoid sensitive content leakage
      this.filterSecrets(body);

      //Create request
      const request = {
        method: 'POST',
        url: '/v3/mail/send',
        body,
      };

      //Send
      return this.client.request(request, cb);
    } catch (error) {

      //Pass to callback if provided
      if (cb) {
        // eslint-disable-next-line callback-return
        cb(error, null);
      }

      //Reject promise
      return Promise.reject(error);
    }
  }

  /**
   * Send multiple emails (shortcut)
   */
  sendMultiple(data, cb) {
    return this.send(data, true, cb);
  }
}

//Export class
module.exports = MailService;

},{"@sendgrid/client":2,"@sendgrid/helpers":27}],30:[function(require,module,exports){
'use strict';

/**
 * Dependencies
 */
const MailService = require('./classes/mail-service');

//Export singleton instance
module.exports = new MailService();

},{"./classes/mail-service":29}],31:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":33}],32:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":39,"../core/createError":40,"./../core/settle":44,"./../helpers/buildURL":48,"./../helpers/cookies":50,"./../helpers/isURLSameOrigin":52,"./../helpers/parseHeaders":54,"./../utils":56}],33:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":34,"./cancel/CancelToken":35,"./cancel/isCancel":36,"./core/Axios":37,"./core/mergeConfig":43,"./defaults":46,"./helpers/bind":47,"./helpers/spread":55,"./utils":56}],34:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],35:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":34}],36:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],37:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":48,"./../utils":56,"./InterceptorManager":38,"./dispatchRequest":41,"./mergeConfig":43}],38:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":56}],39:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":49,"../helpers/isAbsoluteURL":51}],40:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":42}],41:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":36,"../defaults":46,"./../utils":56,"./transformData":45}],42:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],43:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

},{"../utils":56}],44:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":40}],45:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":56}],46:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":32,"./adapters/xhr":32,"./helpers/normalizeHeaderName":53,"./utils":56,"_process":63}],47:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],48:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":56}],49:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],50:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":56}],51:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],52:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":56}],53:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":56}],54:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":56}],55:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],56:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":47}],57:[function(require,module,exports){
'use strict';

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;

},{}],58:[function(require,module,exports){

},{}],59:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],60:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":59,"buffer":60,"ieee754":61}],61:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],62:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":63}],63:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
