const express = require('express');
const app = express();
const semafoareDb = require('./semafoare').data;

app.post('/get-semafoare', function (req, res) {

    const startLat = req.query.start_lat;
    const startLng = req.query.start_lng;
    const endLat = req.query.end_lat;
    const endLng = req.query.end_lng;

    const point1 = {
        lng: startLng,
        lat: startLat
    };
    const point2 = {
        lng: endLng,
        lat: endLat
    };

    const messages = [];

    semafoareDb.map((semafor, i) => {
        const currPoint = semafor;

        const dxc = currPoint.lng - point1.lng;
        const dyc = currPoint.lat - point1.lat;

        const dxl = point2.lng - point1.lng;
        const dyl = point2.lat - point1.lat;

        const cross = dxc * dyl - dyc * dxl;

        if (cross === 0) {
            messages[i] = 'On the same line.';

            let response = '';
            if (Math.abs(dxl) >= Math.abs(dyl)) {
                response =  dxl > 0 ?
                point1.lng <= currPoint.lng && currPoint.lng <= point2.lng :
                point2.lng <= currPoint.lng && currPoint.lng <= point1.lng;
            }
            else {
                response = dyl > 0 ?
                point1.lat <= currPoint.lat && currPoint.lat <= point2.lat :
                point2.lat <= currPoint.lat && currPoint.lat <= point1.lat;
            }

            if (response) {
                messages[i] += ` & between the points of ${semafor.name}`;
            }
        }
        else {
            messages[i] = `Not on the same line with ${semafor.name}`;
        }

    });

    res.send(JSON.stringify(messages));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
