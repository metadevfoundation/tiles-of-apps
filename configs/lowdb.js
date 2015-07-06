var low = require('lowdb')

module.exports = function() {
		var db = low('db.json')
    return db
}()