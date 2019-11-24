var _ = Infinity;

var srccntr = 0;
var destcntr = 0;
var path1 = [], path2 = [], orderID = [];
var netcost1, netcost2;
var deliveryIndex = 0;
var cost = [];
var distance = [];
var costDelivery = [],distDelivery = [];

// var myMovingMarker = {};
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
        path1[deliveryIndex] = constructPath(shortestPathInfo1, destcntr);
        path1[deliveryIndex].unshift(srccntr);
        for(var i=1;i<path1[deliveryIndex].length;i++)
        {
            ///console.log("h")
            costDelivery.push([path1[deliveryIndex][i-1],path1[deliveryIndex][i]])
        }
        //console.log(costDelivery)
        netcost1 = 0;
        for (var i = 0; i < path1[deliveryIndex].length - 1; i++) {
            netcost1 += cost[path1[deliveryIndex][i]][path1[deliveryIndex][i + 1]];
        }
        if(document.getElementById("p3").checked)
        {
            netcost1+=path1[deliveryIndex].length*10
        }
        if (document.getElementById('p4').checked) {
            netcost1+=path1[deliveryIndex].length*20
        }
        else if (document.getElementById('p5').checked) {
            netcost1+=path1[deliveryIndex].length*30
        }
        else if (document.getElementById('p6').checked) {
            netcost1+=path1[deliveryIndex].length*40
        }
        document.getElementById("p1").innerHTML = "Price: " + netcost1;

            // Compute the shortest path on the basis of distance
        var shortestPathInfo2 = shortestPath(distance, 6, srccntr);

        // Get the shortest path from vertex srccntr to vertex destcntr.
        path2[deliveryIndex] = constructPath(shortestPathInfo2, destcntr);
        path2[deliveryIndex].unshift(srccntr);
        for(var i=1;i<path2[deliveryIndex].length;i++)
        {
            ///console.log("h")
            distDelivery.push([path2[deliveryIndex][i-1],path2[deliveryIndex][i]])
        }
        //console.log(distDelivery)
        netcost2 = 0;
        for (var i = 0; i < path2[deliveryIndex].length - 1; i++) {
            netcost2 += cost[path2[deliveryIndex][i]][path2[deliveryIndex][i + 1]];
        }
        if(document.getElementById("p3").checked)
        {
            netcost2+=path2[deliveryIndex].length*10
        }
        if (document.getElementById('p4').checked) {
            netcost2+=path2[deliveryIndex].length*20
        }
        else if (document.getElementById('p5').checked) {
            netcost2+=path2[deliveryIndex].length*30
        }
        else if (document.getElementById('p6').checked) {
            netcost2+=path2[deliveryIndex].length*40
        }
        document.getElementById("p2").innerHTML = "Price: " + netcost2;

    }
}
map.on('click', computecost);
document.getElementById("p3").addEventListener('change', computecost);
document.getElementById("p4").addEventListener('change', computecost);
document.getElementById("p5").addEventListener('change', computecost);
document.getElementById("p6").addEventListener('change', computecost);


// Called Only when placed order with Economic option
function PrintCostPath(index, sourceLat, sourceLong, destinationLat, destinationLong) {
    var intervalId, runcount;
    var myMovingMarker = {};
    if (flag1 == 1 && flag2 == 1) {
        //Calling Function to update and place ethers in contract
        Coursetro.updateCostMatrix(costDelivery,{from: web3.eth.defaultAccount, gas: 3000000, value: 10},(err, res)=>{
            if(err) throw err;
            orderID[deliveryIndex] = res;
            console.log("result : " + res);
        });
        runcount = 0;
        function PrintPath() {
            if (runcount == (path1[index].length - 1)) {
                clearInterval(intervalId)
            }
            if (runcount != (path1[index].length - 1)) {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path1[index][runcount]], wareHouseLong[path1[index][runcount]]], [wareHouseLat[path1[index][runcount + 1]], wareHouseLong[path1[index][runcount + 1]]]],
                    [4000], { icon: droneIcon }).addTo(map);
                myMovingMarker.start();
            }
            else {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path1[index][(path1[index].length - 1)]], wareHouseLong[path1[index][(path1[index].length - 1)]]], [destinationLat, destinationLong]],
                    [4000], { icon: packagedlvr }).addTo(map);
                myMovingMarker.start();
                setTimeout(function () { myMovingMarker.bindPopup("<b>Package Delivered!</b><br>").openPopup();
                    // function to release the ethers associated with this orderID
                    Coursetro.deliveryComplete(orderID[deliveryIndex], costDelivery, (err, res) => {
                        if(err) throw err;
                        console.log(res);
                    });
                }, 4000);
            }
            runcount++;
        }


        myMovingMarker = L.Marker.movingMarker([[sourceLat, sourceLong], [wareHouseLat[path1[index][0]], wareHouseLong[path1[index][0]]]],
            [4000], { icon: packageacpt }).addTo(map);
        myMovingMarker.start();

        intervalId = setInterval(PrintPath, 4000)
        
        curr = -1;
        flag1 = 0, flag2 = 0;
        deliveryIndex++;
    }
}

function PrintDistPath(index, sourceLat, sourceLong, destinationLat, destinationLong) {
    var intervalId, runcount;
    var myMovingMarker = {};
    
    if (flag1 == 1 && flag2 == 1) {
        runcount = 0;
        function PrintPath() {
            if (runcount == (path2[index].length - 1)) {
                clearInterval(intervalId)
            }
            if (runcount != (path2[index].length - 1)) {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path2[index][runcount]], wareHouseLong[path2[index][runcount]]], [wareHouseLat[path2[index][runcount + 1]], wareHouseLong[path2[index][runcount + 1]]]],
                    [4000], { icon: droneIcon }).addTo(map);

                myMovingMarker.start();
            }
            else {
                if (myMovingMarker != undefined) {
                    map.removeLayer(myMovingMarker);
                }
                myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path2[index][(path2[index].length - 1)]], wareHouseLong[path2[index][(path2[index].length - 1)]]], [destinationLat, destinationLong]],
                    [4000], { icon: packagedlvr }).addTo(map);
                myMovingMarker.start();
                setTimeout(function () { myMovingMarker.bindPopup("<b>Package Delivered!</b><br>").openPopup(); }, 4000);

            }
            runcount++;
        }

        myMovingMarker = L.Marker.movingMarker([[sourceLat, sourceLong], [wareHouseLat[path2[index][0]], wareHouseLong[path2[index][0]]]],
            [4000], { icon: packageacpt }).addTo(map);
        myMovingMarker.start();

        intervalId = setInterval(PrintPath, 4000)
        curr = -1;
        flag1 = 0, flag2 = 0;
        deliveryIndex++;
    }
}

dist_deliver.addEventListener('click', () => {
    PrintDistPath(deliveryIndex, sourceLat, sourceLong, destinationLat, destinationLong);
});
cost_deliver.addEventListener('click', () => {
    PrintCostPath(deliveryIndex, sourceLat, sourceLong, destinationLat, destinationLong);
});
src.addEventListener('click', fetchmatrix);