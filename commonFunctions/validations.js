exports.getCurrentDateInSpecialFormat = function () {
	var date = new Date();
	const monthNDay = [date.getMonth() + 1, date.getDate()].map(date => 
		date.toString().replace(/^([0-9])$/, '0$1')
	)
	return date.getFullYear() + monthNDay[1] + monthNDay[0]
}

exports.processCoordinate = function (coordinate, type) {
	if(Number(coordinate)) {
		coordinate = Number(coordinate).toFixed(6)
	}
	console.log("coordinate:", coordinate)
	if (new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/).exec(coordinate))
		return coordinate
	else
		throw new Error(type)
}
	
exports.processName = function (name, type) {
	if(name && new RegExp(/^[a-z]{1,20}$/).exec(name))
		return name
	else
		throw new Error(type)
}

exports.processRadius = function (r) {
	if(new RegExp(/^\d{1,2}$|^1{1}0{2}$|^0{1}$/).exec(r))
		return r < 1 ? 1000 : r * 1000
	else 
		throw new Error('radius')
}