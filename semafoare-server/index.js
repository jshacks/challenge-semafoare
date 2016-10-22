const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const semafoareDb = require('./semafoare').data;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/get-semafoare', function (req, res) {

    console.log(req.body);
    const pathSteps = req.body;

    const responseData = [];

    pathSteps.map((step, i) => {

        const startLat = step.start_location.lat;
        const startLng = step.start_location.lng;
        const endLat = step.end_location.lat;
        const endLng = step.end_location.lng;

        const point1 = {
            lng: startLng,
            lat: startLat
        };
        const point2 = {
            lng: endLng,
            lat: endLat
        };

        responseData[i] = [];

        semafoareDb.map((semafor, j) => {
            const currPoint = semafor;

            const dxc = currPoint.lng - point1.lng;
            const dyc = currPoint.lat - point1.lat;

            const dxl = point2.lng - point1.lng;
            const dyl = point2.lat - point1.lat;

            const cross = dxc * dyl - dyc * dxl;

            if (cross === 0) {

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
                    responseData[i][j] = semafor;
                }
            }

        });

    });

    res.send(JSON.stringify(responseData));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
