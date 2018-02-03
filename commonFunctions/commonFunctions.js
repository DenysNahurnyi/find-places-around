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
				v: getCurrentDateInSpecialFormat()
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

function getCurrentDateInSpecialFormat() {
	var date = new Date();
	const monthNDay = [date.getMonth() + 1, date.getDate()].map(date => 
		date.toString().replace(/^([0-9])$/, '0$1')
	)
	return date.getFullYear() + monthNDay[1] + monthNDay[0]
}

const processCoordinate = (coordinate, type) => {
	if(Number(coordinate)) {
		coordinate = Number(coordinate).toFixed(6)
	}
	console.log("coordinate:", coordinate)
	if (new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/).exec(coordinate))
		return coordinate
	else
		throw new Error(type)
}
	
const processName = (name, type) => {
	if(name && new RegExp(/^[a-z]{1,20}$/).exec(name))
		return name
	else
		throw new Error(type)
}

const processRadius = r => {
	if(new RegExp(/^\d{1,2}$|^1{1}0{2}$|^0{1}$/).exec(r))
		return r < 1 ? 1000 : r * 1000
	else 
		throw new Error('radius')
}

exports.processInputParams = function(params) {
	try {
		return {
			venueType: processName(params.venueType, 'Venue type'),
			radius: processRadius(params.radius),
			latitude: processCoordinate(params.latitude, 'latitude'),
			longitude: processCoordinate(params.longitude, 'longitude')
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