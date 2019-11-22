var dist12 = getDistance([wareHouseLat[0], wareHouseLong[0]], [wareHouseLat[1], wareHouseLong[1]]);
var dist13 = getDistance([wareHouseLat[0], wareHouseLong[0]], [wareHouseLat[2], wareHouseLong[2]]);
var dist15 = getDistance([wareHouseLat[0], wareHouseLong[0]], [wareHouseLat[4], wareHouseLong[4]]);
var dist16 = getDistance([wareHouseLat[0], wareHouseLong[0]], [wareHouseLat[5], wareHouseLong[5]]);
var dist23 = getDistance([wareHouseLat[1], wareHouseLong[1]], [wareHouseLat[2], wareHouseLong[2]]);
var dist24 = getDistance([wareHouseLat[1], wareHouseLong[1]], [wareHouseLat[3], wareHouseLong[3]]);
var dist26 = getDistance([wareHouseLat[1], wareHouseLong[1]], [wareHouseLat[5], wareHouseLong[5]]);
var dist34 = getDistance([wareHouseLat[2], wareHouseLong[2]], [wareHouseLat[3], wareHouseLong[3]]);
var dist35 = getDistance([wareHouseLat[2], wareHouseLong[2]], [wareHouseLat[4], wareHouseLong[4]]);
var dist45 = getDistance([wareHouseLat[3], wareHouseLong[3]], [wareHouseLat[4], wareHouseLong[4]]);
var dist46 = getDistance([wareHouseLat[3], wareHouseLong[3]], [wareHouseLat[5], wareHouseLong[5]]);
var dist56 = getDistance([wareHouseLat[4], wareHouseLong[4]], [wareHouseLat[5], wareHouseLong[5]]);
var srccntr = 0;
var destcntr = 0;

var _ = Infinity;
var distance = [
    [_, dist12, dist13, _, dist15, dist16],
    [dist12, _, dist23, dist24, _, dist26],
    [dist13, dist23, _, dist34, dist35, _],
    [_, dist24, dist34, _, dist45, dist46],
    [dist15, _, dist35, dist45, _, dist56],
    [dist16, dist26, _, dist46, dist56, _]
];


var cost = [
    [_, 500, 1000, _, 1500, 900],
    [500, _, 400, 1500, _, 300],
    [1000, 400, _, 1000, 400, _],
    [_, 1500, 1000, _, 500, 1500],
    [1500, _, 400, 500, _, 500],
    [900, 300, _, 1500, 500, _]
];

var srccntr = 0;
var destcntr = 0;
var path1, path2, netcost1, netcost2;
function computecost() {
    if (flag1 == 1 && flag2 == 1) {
        var nearestcentres = nearcntr();
        srccntr = nearestcentres[0];
        destcntr = nearestcentres[1];

        // Compute the shortest path on the basis of cost
        var shortestPathInfo1 = shortestPath(cost, 6, srccntr);

        // Get the shortest path from vertex srccntr to vertex destcntr.
        path1 = constructPath(shortestPathInfo1, destcntr);
        path1.unshift(srccntr);

        // Compute the shortest path on the basis of distance
        var shortestPathInfo2 = shortestPath(distance, 6, srccntr);

        // Get the shortest path from vertex srccntr to vertex destcntr.
        path2 = constructPath(shortestPathInfo2, destcntr);
        path2.unshift(srccntr);

        netcost1 = 0;
        for (var i = 0; i < path1.length - 1; i++) {
            netcost1 += cost[path1[i]][path1[i + 1]];
        }
        console.log(netcost1)
        document.getElementById("p1").innerHTML = "Price: " + netcost1;

        netcost2 = 0;
        for (var i = 0; i < path2.length - 1; i++) {
            netcost2 += cost[path2[i]][path2[i + 1]];
        }

        document.getElementById("p2").innerHTML = "Price: " + netcost2;
        console.log(netcost2)
    }
}
map.on('click', computecost);

var intervalId;
var runcount ;
var myMovingMarker = {};

function PrintCostPath() {
    if (flag1 == 1 && flag2 == 1) {
        runcount=0;
        function PrintPath() {
            if (runcount == (path1.length - 1)) {
                clearInterval(intervalId)
            }
            if (runcount != (path1.length - 1)) {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path1[runcount]], wareHouseLong[path1[runcount]]], [wareHouseLat[path1[runcount + 1]], wareHouseLong[path1[runcount + 1]]]],
                    [4000], { icon: droneIcon }).addTo(map).bindPopup("<b>Package is On The Way!</b><br>").openPopup();

                myMovingMarker.start();
            }
            else {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path1[(path1.length - 1)]], wareHouseLong[path1[(path1.length - 1)]]], [destinationLat, destinationLong]],
                    [4000], { icon: packagedlvr }).addTo(map).bindPopup("<b>Package is Out For Delivery!</b><br>").openPopup();
                myMovingMarker.start();
                setTimeout(function(){ myMovingMarker.bindPopup("<b>Package Delivered!</b><br>").openPopup();}, 4000);

            }
            runcount++;
        }


        myMovingMarker = L.Marker.movingMarker([[sourceLat, sourceLong], [wareHouseLat[path1[0]], wareHouseLong[path1[0]]]],
            [4000], { icon: packageacpt }).addTo(map);
        myMovingMarker.start();

        intervalId = setInterval(PrintPath, 4000)
        curr = -1;
        flag1 = 0, flag2 = 0;
    }
}
cost_deliver.addEventListener('click', PrintCostPath);

function PrintDistPath() {
    if (flag1 == 1 && flag2 == 1) {
        runcount=0;
        function PrintPath() {
            if (runcount == (path2.length - 1)) {
                clearInterval(intervalId)
            }
            if (runcount != (path2.length - 1)) {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path2[runcount]], wareHouseLong[path2[runcount]]], [wareHouseLat[path2[runcount + 1]], wareHouseLong[path2[runcount + 1]]]],
                    [4000], { icon: droneIcon }).addTo(map).bindPopup("<b>Package is On The Way!</b><br>").openPopup();

                myMovingMarker.start();
            }
            else {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path2[(path2.length - 1)]], wareHouseLong[path2[(path2.length - 1)]]], [destinationLat, destinationLong]],
                    [4000], { icon: packagedlvr }).addTo(map).bindPopup("<b>Package is Out For Delivery!</b><br>").openPopup();
                myMovingMarker.start();
                setTimeout(function(){ myMovingMarker.bindPopup("<b>Package Delivered!</b><br>").openPopup();}, 4000);

            }
            runcount++;
        }


        myMovingMarker = L.Marker.movingMarker([[sourceLat, sourceLong], [wareHouseLat[path2[0]], wareHouseLong[path2[0]]]],
            [4000], { icon: packageacpt }).addTo(map);
        myMovingMarker.start();

        intervalId = setInterval(PrintPath, 4000)
        curr = -1;
        flag1 = 0, flag2 = 0;
    }
}
dist_deliver.addEventListener('click', PrintDistPath);