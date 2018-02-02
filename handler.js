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
  const fs = require('fs')

  const columnNames = ["Name", "City", "Street address", "Latitude", "Longitude"]
  
  let receivedData = null, errorInChain = null;
  getFoursquareData()
    .then(data => {
      const json2csv = require('json2csv')

      console.log('Data fetched successfully')
      fs.writeFileSync('/tmp/places.csv', json2csv({data: data, fields: columnNames }))
    })
    .catch(err => {
      console.log('Data fetch failed\n', err)
      receivedData = err
    })
    .then(() => {
      let response = null
      if(!errorInChain) {
        let data = fs.readFileSync('/tmp/places.csv');
        response = {
          statusCode: 200,
          headers: {'Content-type' : 'text/csv'}, // text/csv
          body: data.toString('utf8')
        };
      } else {
          response = {
          statusCode: 200,
          headers: {'Content-type' : 'text/plain'}, // text/csv
          body: errorInChain.toString('utf8')
        };
      }
      // const response = {
      //   statusCode: 200,
      //   body: JSON.stringify(receivedData)
      // };
      callback(null, response)
    })

    

  

  

  
};

function getFoursquareData(params = {}) {
  const request = require('request');
  const config = require('config');
  return new Promise((res, rej) => {
    let qs = {
      client_id: config.app.Foursquare.Id,
      client_secret: config.app.Foursquare.Secret,
      ll: params.latitude && params.longitude ? (params.latitude + ',' + params.longitude) : '40.73,-73.93', // '40.73,-73.93'
      radius: params.radius || 10 * 1000, // 10 * 1000
      query: params.venueType || 'museum', // museum
      v: getCurrentDateInSpecialFormat()
    }
    console.log(qs)
    request({
      url: 'https://api.foursquare.com/v2/venues/explore',
      method: 'GET',
      qs 
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
    Name: item.venue.name,
    City: item.venue.location.city,
    'Street address': item.venue.location.address,
    Latitude: item.venue.location.lat,
    Longitude: item.venue.location.lng
  }))
}

function getCurrentDateInSpecialFormat() {
  var date = new Date();
  const monthNDay = [date.getMonth() + 1, date.getDate()].map(date => 
    date.toString().replace(/^([0-9])$/, '0$1')
  )
  return date.getFullYear() + monthNDay[1] + monthNDay[0]
}