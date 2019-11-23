var _ = Infinity;

var srccntr = 0;
var destcntr = 0;
var path1, path2, netcost1, netcost2;
var cost = [];
var distance = [];
var myMovingMarker = {};
function fetchmatrix() {
    Coursetro.getMatrixCost((err, res) => {

        if (err) throw err;

        res.forEach(arr => {
            let row = [];
            arr.forEach(elem => {
                if (elem.c[0] == 1)
                    row.push(_);
                else
                    row.push(elem.c[0]);
            })
            cost.push(row);
        });
        console.log("cost => ", cost);
    });

    Coursetro.getMatrixDistance((err, res) => {
        if (err) throw err;

        res.forEach(arr => {
            let row = [];
            arr.forEach(elem => {
                if (elem.c[0] == 1)
                    row.push(_);
                else
                    row.push(elem.c[0]);
            })
            distance.push(row);
        })
        console.log("distance => ", distance);
    });
}
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
        netcost1 = 0;
        for (var i = 0; i < path1.length - 1; i++) {
            netcost1 += cost[path1[i]][path1[i + 1]];
        }
        document.getElementById("p1").innerHTML = "Price: " + netcost1;

            // Compute the shortest path on the basis of distance
        var shortestPathInfo2 = shortestPath(distance, 6, srccntr);

        // Get the shortest path from vertex srccntr to vertex destcntr.
        path2 = constructPath(shortestPathInfo2, destcntr);
        path2.unshift(srccntr);
        netcost2 = 0;
        for (var i = 0; i < path2.length - 1; i++) {
            netcost2 += cost[path2[i]][path2[i + 1]];
        }

        document.getElementById("p2").innerHTML = "Price: " + netcost2;

    }
}
map.on('click', computecost);

var intervalId;
var runcount;

function PrintCostPath() {
    if (flag1 == 1 && flag2 == 1) {
        runcount = 0;
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
                setTimeout(function () { myMovingMarker.bindPopup("<b>Package Delivered!</b><br>").openPopup(); }, 4000);

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

function PrintDistPath() {
    if (flag1 == 1 && flag2 == 1) {
        runcount = 0;
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
                setTimeout(function () { myMovingMarker.bindPopup("<b>Package Delivered!</b><br>").openPopup(); }, 4000);

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
cost_deliver.addEventListener('click', PrintCostPath);
src.addEventListener('click', fetchmatrix);
