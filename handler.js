"use strict";

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step("next", value);
            },
            function(err) {
              step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}

const common = require("./commonFunctions/commonFunctions");

module.exports.getVenuesCSVNext = (() => {
  var _ref = _asyncToGenerator(function*(event, context, callback) {
    try {
      const userInput = common.processInputParams(JSON.parse(event.body));
      const venuesData = yield common.getFoursquareData(userInput);
      const response = common.getMainResponse(
        event.headers["Accept"],
        venuesData
      );

      callback(null, response);
    } catch (err) {
      const response = {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: String(err)
      };
      callback(null, response);
    }
  });

  return function(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

// module.exports.getVenuesJSON = (event, context, callback) => {
// 	console.log("2")
// 	let receivedData = null, errorInChain = null;
// 	try {
// 		const userInput = common.processInputParams(JSON.parse(event.body))

// 		common.getFoursquareData(userInput)
// 			.then(data => {
// 				console.log('Data fetched successfully')
// 				receivedData = data
// 			})
// 			.catch(err => {
// 				console.log('Data fetch failed\n', err)
// 				receivedData = err
// 			})
// 			.then(() => {
// 				const response = {
// 					statusCode: 200,
// 					headers: {'Content-type' : 'text/plain'},
// 					body: JSON.stringify(receivedData)
// 				};
// 				callback(null, response)
// 			})
// 	} catch(err) {
// 		const response = {
// 			statusCode: 400,
// 			headers: {'Content-type' : 'text/plain'},
// 			body: String(err)
// 		};
// 		callback(null, response)
// 		return
// 	}
// };

// module.exports.getVenuesCSV = (event, context, callback) => {

// 	console.log("3")
// 	const columnNames = ["Name", "City", "Street address", "Latitude", "Longitude"]
// 	let receivedData = null, errorInChain = null;
// 	try {
// 		const userInput = common.processInputParams(JSON.parse(event.body))

// 		common.getFoursquareData(userInput)
// 			.then(data => {
// 				console.log('Data fetched successfully')
// 				fs.writeFileSync('/tmp/places.csv', json2csv({data: data, fields: columnNames }))
// 			})
// 			.catch(err => {
// 				console.log('Data fetch failed\n', err)
// 				receivedData = err
// 			})
// 			.then(() => {
// 				let response = {
// 					statusCode: 200,
// 					headers: null,
// 					body: null
// 				}
// 				if(!errorInChain) {
// 					let data = fs.readFileSync('/tmp/places.csv');
// 					response.headers = {'Content-type' : 'text/csv'}
// 					response.body = data.toString('binary')
// 				} else {
// 						response.headers = {'Content-type' : 'text/plain'}
// 						response.body = errorInChain.toString('utf8')
// 				}
// 				callback(null, response)
// 			})
// 	} catch(err) {
// 		const response = {
// 			statusCode: 400,
// 			headers: {'Content-type' : 'text/plain'},
// 			body: String(err)
// 		};
// 		callback(null, response)
// 		return
// 	}

// };

// module.exports.getVenuesJSONNext = async (event, context, callback) => {
// 	let response = {
// 		statusCode: 200,
// 		headers: null,
// 		body: null
// 	}
// 	try {
// 		const userInput = common.processInputParams(JSON.parse(event.body))

// 		const venuesData = await common.getFoursquareData(userInput);

// 		response.headers = {'Content-Type' : 'text/plain; charset=utf-8'}
// 		response.body = venuesData

// 		callback(null, response)
// 	} catch(err) {
// 		response = {
// 			statusCode: 400,
// 			headers: {'Content-Type' : 'text/plain'},
// 			body: String(err)
// 		};
// 		callback(null, response)
// 	}
// };
