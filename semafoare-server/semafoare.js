const semafoareDb = require('./semafoare-db.json');
const UPDATE_INTERVAL = 1000;

var serverTime = new Date().getTime();

for (var i = 0; i < semafoareDb.length; i++) {
    var semafor = semafoareDb[i];
    var dateOrigin = new Date(semafor.dateOrigin).getTime();
    var dateGap = serverTime - dateOrigin;
    var semaforCicle = semafor.timeInterval.greenYellow + semafor.timeInterval.red;
    var remaining = dateGap % semaforCicle;

    if (remaining <= semafor.timeInterval.greenYellow) {
        semafor.northSouth = true;
        semafor.eastWest = false;
    }
    else {
        semafor.northSouth = false;
        semafor.eastWest = true;
    }
    semafor.nextChange = remaining;
}


setInterval(function () {
    for (var i = 0; i < semafoareDb.length; i++) {
        var semafor = semafoareDb[i];

        if (semafor.nextChange <= UPDATE_INTERVAL) {
            semafor.northSouth = !semafor.northSouth;
            semafor.eastWest = !semafor.northSouth;
            semafor.nextChange = semafor.northSouth ? semafor.timeInterval.greenYellow : semafor.timeInterval.red;
        } else {
            semafor.nextChange -= UPDATE_INTERVAL;
        }
    }
}, UPDATE_INTERVAL);


module.exports = {
    data: semafoareDb
};
