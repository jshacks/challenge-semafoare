const semafoareDb = require('./semafoare-db.json');
const UPDATE_INTERVAL = 1000;


setInterval(function () {
    for (var i = 0; i < semafoareDb.length; i++) {
        var semafor = semafoareDb[i];
        if (semafor.nextChange <= UPDATE_INTERVAL) {
            semafor.northSouth = !semafor.northSouth;
            semafor.eastWest = !semafor.northSouth;
            semafor.nextChange = semafor.timeInterval;
        } else {
            semafor.nextChange -= UPDATE_INTERVAL;
        }
    }
}, UPDATE_INTERVAL);


module.exports = {
    data: semafoareDb
};
