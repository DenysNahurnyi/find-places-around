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
  // // let _ = require('underscore')
  // console.log('1')
  // // let v1 = _.map([1, 2, 3], function(num){ return num * 3; })
  // console.log('2')
  fs.writeFileSync('/tmp/message.txt', 'Hello Node.js');
  console.log('3')

  let data = fs.readFileSync('/tmp/message.txt');
  console.log('4')
  // // fs.unlinkSync('/tmp/message.txt');

  let response = {
    statusCode: 200,
    headers: {'Content-type' : 'text/plain'},
    body: data.toString('utf8'),
    isBase64Encoded : true,
  };
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'v1.0'
  //   }),
  // };

  callback(null, response);
};