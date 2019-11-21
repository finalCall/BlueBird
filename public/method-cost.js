var srccntr = 0;
var destcntr = 0;

var _ = Infinity;
var cost = [
  [_, 500, 1000, _, 1500, 900],
  [500, _, 400, 1500, _, 300],
  [1000, 400, _, 1000, 400, _],
  [_, 1500, 1000, _, 500, 1500],
  [1500, _, 400, 500, _, 500],
  [900, 300, _, 1500, 500, _]
];


function cost_path() {
  if (flag1 == 1 && flag2 == 1) {
    var nearestcentres = nearcntr();
    srccntr = nearestcentres[0];
    destcntr = nearestcentres[1];

    // Compute the shortest paths from vertex number srccntr to each other vertex
    // in the graph.
    var shortestPathInfo = shortestPath(cost, 6, srccntr);

    // Get the shortest path from vertex srccntr to vertex destcntr.
    var path = constructPath(shortestPathInfo, destcntr);
    //console.log(path)
    path.unshift(srccntr);
    //console.log(path)

    //Printing Path

    var intervalId;
    var runcount = 0;
    var myMovingMarker ={};
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
      [4000], { icon: packageacpt  }).addTo(map);
    myMovingMarker.start();

    intervalId = setInterval(PrintPath, 4000)
    curr = -1;
    flag1 = 0, flag2 = 0;
  }
}
cost_deliver.addEventListener('click', cost_path);
