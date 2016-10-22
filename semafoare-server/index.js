const express = require('express');
const app = express();

app.get('/', function (req, res) {

    // GOOD points
    const point1 = {
        x: 24.5050602,
        y: 43.7764338
    };
    const point2 = {
        x: 24.5064149,
        y: 43.7804849
    };

    // BAD points
    // const point1 = {
    //     x: 24.508422,
    //     y: 43.779596
    // };
    // const point2 = {
    //     x: 24.5083147,
    //     y: 43.7806069
    // };

    const currPoint = {
        x: 24.5050602,
        y: 43.7764338
    };

    const dxc = currPoint.x - point1.x;
    const dyc = currPoint.y - point1.y;

    const dxl = point2.x - point1.x;
    const dyl = point2.y - point1.y;

    const cross = dxc * dyl - dyc * dxl;

    let msg = '';

    if (cross === 0) {
        msg = 'On the same line.';
    }
    else {
        msg = 'Not on the same line.'
    }

    let response = '';
    if (Math.abs(dxl) >= Math.abs(dyl)) {
        response =  dxl > 0 ?
        point1.x <= currPoint.x && currPoint.x <= point2.x :
        point2.x <= currPoint.x && currPoint.x <= point1.x;
    }
    else {
        response = dyl > 0 ?
        point1.y <= currPoint.y && currPoint.y <= point2.y :
        point2.y <= currPoint.y && currPoint.y <= point1.y;
    }

    res.send(`${msg}: ${response}`);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
