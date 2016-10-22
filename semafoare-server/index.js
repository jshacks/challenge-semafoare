const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const semafoareDb = require('./semafoare').data;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/get-semafoare', function (req, res) {

    const pathSteps = req.body;

    const responseData = [];

    pathSteps.map((step, i) => {

        const startLat = step.start_location.lat;
        const startLng = step.start_location.lng;
        const endLat = step.end_location.lat;
        const endLng = step.end_location.lng;

        // calculate direction
        const latDiff = Math.abs(endLat - startLat);
        const lngDiff = Math.abs(endLng - startLng);

        var isNorthSouth = latDiff >= lngDiff;

        const point1 = {
            lng: parseFloat(startLng).toFixed(7),
            lat: parseFloat(startLat).toFixed(7)
        };
        const point2 = {
            lng: parseFloat(endLng).toFixed(7),
            lat: parseFloat(endLat).toFixed(7)
        };

        semafoareDb.map((semafor, j) => {
            const currPoint = semafor;
            currPoint.lng = parseFloat(currPoint.lng).toFixed(7);
            currPoint.lat = parseFloat(currPoint.lat).toFixed(7);

            const dxc = (currPoint.lng - point1.lng) * 10000;
            const dyc = (currPoint.lat - point1.lat) * 10000;

            const dxl = (point2.lng - point1.lng) * 10000;
            const dyl = (point2.lat - point1.lat) * 10000;

            const cross = (dxc * dyl - dyc * dxl) / 10000;

            const threshold = 0.000001;

            console.log(semafor.id, i, '||||', Math.abs(cross), threshold, Math.abs(cross) < threshold);
            if (Math.abs(cross) < threshold) {

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

                if (response && responseData.indexOf(semafor) === -1) {
                    semafor.isGreen = isNorthSouth ? semafor.northSouth : semafor.eastWest;
                    responseData.push(semafor);
                }
            }

        });

    });

    res.json(responseData);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
