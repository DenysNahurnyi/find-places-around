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

  // fs.writeFileSync('/tmp/message.txt', 'Hello Node.js');
  // let data = fs.readFileSync('/tmp/message.txt');
  
  let receivedData = null;
  getFoursquareData()
    .then(data => {
      console.log('Data fetched successfully')
      receivedData = data
    })
    .catch(err => {
      console.log('Data fetch failed')
      receivedData = err
    })
    .then(() => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(receivedData)
      };
      callback(null, response)
    })

    

  

  // let response = {
  //   statusCode: 200,
  //   headers: {'Content-type' : 'text/plain'}, // text/csv
  //   body: data.toString('utf8')
  // };

  
};

function getFoursquareData() {
  const request = require('request');  
  const config = require('config');  
  return new Promise((res, rej) => {
    request({
      url: 'https://api.foursquare.com/v2/venues/explore',
      method: 'GET',
      qs: {
        client_id: config.app.Foursquare.Id,
        client_secret: config.app.Foursquare.Secret,
        ll: '40.73,-73.93',
        radius: 100000,
        query: 'museum',
        v: '20180102'
      }
    }, function(err, r, body) {
      if (err) {
        console.error(err);
        rej(err)
      } else {
        res(getBodyParameters(body));
      }
    });
  })
}

function getBodyParameters(str) {
  const fRes = JSON.parse(str)
  return fRes.response.groups[0].items.map(item => ({
    name: item.venue.name,
    city: item.venue.location.city,
    'street address': item.venue.location.address,
    latitude: item.venue.location.lat,
    longitude: item.venue.location.lng,
  }))
}