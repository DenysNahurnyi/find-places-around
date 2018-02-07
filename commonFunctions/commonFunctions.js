const json2csv = require('json2csv')

const validation = require('./validations')

exports.getFoursquareData = function (params = {}) {
	const request = require('request')
	const config = require('config')

	return new Promise((res, rej) => {
		request({
		url: 'https://api.foursquare.com/v2/venues/explore',
		method: 'GET',
		qs: {
				client_id: config.app.Foursquare.Id,
				client_secret: config.app.Foursquare.Secret,
				ll: params.latitude + ',' + params.longitude,
				radius: params.radius,
				query: params.venueType,
				v: validation.getCurrentDateInSpecialFormat()
		}
		}, (err, r, body) => {
			err ? rej(err) : res(getBodyParameters(body))
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

exports.processInputParams = function(params) {
	try {
		return {
			venueType: validation.processName(params.venueType, 'Venue type'),
			radius: validation.processRadius(params.radius),
			latitude: validation.processCoordinate(params.latitude, 'latitude'),
			longitude: validation.processCoordinate(params.longitude, 'longitude')
		}
	} catch (err) {
		console.log(err)
		const expectedInput = {
			venueType: "String in legth from 1 to 20 latin letters",
			radius: "Number from 0 to 1000",
			latitude: "Float number from -89.999999 to 89.999999",
			longitude: "Float number from -89.999999 to 89.999999"
		}
		throw new Error('Incorrect input parameter: '+ err.message +'\nExpected:\n' + JSON.stringify(expectedInput))
	}
}

exports.getMainResponse = function (acceptHeader, venuesData) {
	switch(acceptHeader) {
		case 'text/csv': {
			return getCSVResponse(venuesData)
		}
		case 'application/json': {
			return getJSONResponse(venuesData)
		}
		default: {
			throw new Error("Please enter preferable content type for response in Accept header")			
		}
	}
}

const getCSVResponse = function(venuesData) {
	const columnNames = ["Name", "City", "Street address", "Latitude", "Longitude"]

	const fileBuffer = json2csv({data: venuesData, fields: columnNames })

	return {
		statusCode: 200,
		headers: {'Content-Type' : 'text/csv; charset=utf-8'},
		body: fileBuffer.toString('binary')
	}
}

const getJSONResponse = function(venuesData) {
	return {
		statusCode: 200,
		headers: {'Content-Type' : 'application/json; charset=utf-8'},
		body: JSON.stringify(venuesData)
	}
}