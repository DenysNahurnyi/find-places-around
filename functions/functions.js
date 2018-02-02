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
				ll: params.latitude && params.longitude ? (params.latitude + ',' + params.longitude) : '40.73,-73.93', // '40.73,-73.93'
				radius: params.radius || 10 * 1000, // 10 * 1000
				query: params.venueType || 'museum', // museum
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

const validateCoordinate = coordinate =>
	new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/).exec(coordinate)
	
const validateName = name =>
	new RegExp(/^[a-z]{1,20}$/).exec(name)

const validateRadius = r => {
	if(new RegExp(/^\d{1,2}$|^1{1}0{2}$|^0{1}$/).exec(r)) {
		return r < 1 ? 1000 : r * 1000
	} else	
			return false
}

	