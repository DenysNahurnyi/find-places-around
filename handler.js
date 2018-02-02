'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'v1.0'
    }),
  };

  callback(null, response);
};


module.exports.test = (event, context, callback) => {
  let fs = require('fs')

  fs.writeFileSync('/tmp/message.txt', 'Hello Node.js');
  let data = fs.readFileSync('/tmp/message.txt');
  let response = {
    statusCode: 200,
    headers: {'Content-type' : 'text/plain'},
    body: data.toString('utf8')
  };

  callback(null, response);
};