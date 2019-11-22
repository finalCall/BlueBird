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


function dist_path() {
  if (flag1 == 1 && flag2 == 1) {
    var nearestcentres = nearcntr();
    srccntr = nearestcentres[0];
    destcntr = nearestcentres[1];

    // Compute the shortest paths from vertex number srccntr to each other vertex
    // in the graph.
    var shortestPathInfo = shortestPath(distance, 6, srccntr);

    // Get the shortest path from vertex srccntr to vertex destcntr.
    var path = constructPath(shortestPathInfo, destcntr);
    path.unshift(srccntr);

    var netcost2 = 0;
    for(var i = 0;i<path.length-1;i++)
    {
      netcost2 += cost[path[i]][path[i+1]];
    }

    document.getElementById("p2").innerHTML = "Price: " + netcost2;
    //Printing Path

    var intervalId;
    var runcount = 0;
    var myMovingMarker = {};
    function PrintPath() {
      if (runcount == (path.length - 1)) {
        clearInterval(intervalId)
      }
      if (runcount != (path.length - 1)) {
          if(myMovingMarker != undefined)
          {
            map.removeLayer(myMovingMarker);
          }
        myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path[runcount]], wareHouseLong[path[runcount]]], [wareHouseLat[path[runcount + 1]], wareHouseLong[path[runcount + 1]]]],
          [4000], { icon: droneIcon }).addTo(map);

        myMovingMarker.start();
      }
      else {
        if(myMovingMarker != undefined)
          {
            map.removeLayer(myMovingMarker);
          }
        myMovingMarker = L.Marker.movingMarker([[wareHouseLat[path[(path.length - 1)]], wareHouseLong[path[(path.length - 1)]]], [destinationLat, destinationLong]],
          [4000], { icon: packagedlvr }).addTo(map);
        myMovingMarker.start();
      }
      runcount++;
    }

    myMovingMarker = L.Marker.movingMarker([[sourceLat, sourceLong], [wareHouseLat[path[0]], wareHouseLong[path[0]]]],
      [4000], { icon: packageacpt }).addTo(map);
    myMovingMarker.start();

    intervalId = setInterval(PrintPath, 4000)
    curr = -1;
    flag1 = 0, flag2 = 0;
  }
}
dist_deliver.addEventListener('click', dist_path);
