'use strict';

module.exports.getVenuesJSON = (event, context, callback) => {
	const funcs = require('./functions/functions')

	let receivedData = null, errorInChain = null;
	funcs.getFoursquareData()
		.then(data => {
			console.log('Data fetched successfully')
			receivedData = data
		})
		.catch(err => {
			console.log('Data fetch failed\n', err)
			receivedData = err
		})
		.then(() => {
			const response = {
				statusCode: 200,
				headers: {'Content-type' : 'text/plain'},
				body: JSON.stringify(receivedData)
			};
			callback(null, response)
		})
};

module.exports.getVenuesCSV = (event, context, callback) => {
	const fs = require('fs')
	const funcs = require('./functions/functions')

	const columnNames = ["Name", "City", "Street address", "Latitude", "Longitude"]
	
	let receivedData = null, errorInChain = null;
	funcs.getFoursquareData()
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
			let response = {
				statusCode: 200,
				headers: null,
				body: null
			}
			if(!errorInChain) {
				let data = fs.readFileSync('/tmp/places.csv');
				response.headers = {'Content-type' : 'text/csv'}
				response.body = data.toString('binary')
			} else {
					response.headers = {'Content-type' : 'text/plain'}
					response.body = errorInChain.toString('utf8')
			}
			callback(null, response)
		})
};