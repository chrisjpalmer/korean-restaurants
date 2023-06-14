// courtesy of: https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js

import mapboxgl from "mapbox-gl";

export function createCircle(center:mapboxgl.LngLat, radiusInMeters:number, points:number = 64) : mapboxgl.AnySourceData {

    var km = radiusInMeters / 1000;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(center.lat*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([center.lng+x, center.lat+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                properties: {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};