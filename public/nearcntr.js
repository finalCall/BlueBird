function nearcntr() {
    var distsrccntr = [];
    var distdestcntr = [];
    var srccntr = 0;
    var destcntr = 0;

    var x;
    distsrccntr[0] = getDistance([sourceLat, sourceLong], [wareHouseLat[0], wareHouseLong[0]]);
    distsrccntr[1] = getDistance([sourceLat, sourceLong], [wareHouseLat[1], wareHouseLong[1]]);
    distsrccntr[2] = getDistance([sourceLat, sourceLong], [wareHouseLat[2], wareHouseLong[2]]);
    distsrccntr[3] = getDistance([sourceLat, sourceLong], [wareHouseLat[3], wareHouseLong[3]]);
    distsrccntr[4] = getDistance([sourceLat, sourceLong], [wareHouseLat[4], wareHouseLong[4]]);
    distsrccntr[5] = getDistance([sourceLat, sourceLong], [wareHouseLat[5], wareHouseLong[5]]);
    x = distsrccntr[0];
    for (var i = 1; i < 6; i++) {
        if (distsrccntr[i] < x) {
            x = distsrccntr[i];
            srccntr = i;
        }
    }
    distdestcntr[0] = getDistance([destinationLat, destinationLong], [wareHouseLat[0], wareHouseLong[0]]);
    distdestcntr[1] = getDistance([destinationLat, destinationLong], [wareHouseLat[1], wareHouseLong[1]]);
    distdestcntr[2] = getDistance([destinationLat, destinationLong], [wareHouseLat[2], wareHouseLong[2]]);
    distdestcntr[3] = getDistance([destinationLat, destinationLong], [wareHouseLat[3], wareHouseLong[3]]);
    distdestcntr[4] = getDistance([destinationLat, destinationLong], [wareHouseLat[4], wareHouseLong[4]]);
    distdestcntr[5] = getDistance([destinationLat, destinationLong], [wareHouseLat[5], wareHouseLong[5]]);

    x = distdestcntr[0];
    for (var i = 1; i < 6; i++) {
        if (distdestcntr[i] < x) {
            x = distdestcntr[i];
            destcntr = i;
        }
    }
    var cntr = [];
    cntr[0] = srccntr;
    cntr[1] = destcntr;
    return cntr;
}