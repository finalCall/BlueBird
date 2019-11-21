pragma solidity >=0.4.21 <0.6.0;

contract bird{
    int24 infi = int24(-1);
    uint orderID = 0;
    mapping(uint => address payable) droneAddress;
    /*
    droneAddress[0] = ;
    droneAddress[1] = ;
    droneAddress[2] = ;
    droneAddress[3] = ;
    droneAddress[4] = ;
    droneAddress[5] = ;
    */
    mapping(uint => uint[6]) paymentDue; // mapping from orderID to payment_due_to_each_drone
    //uint[] paymentOrderIDs;

    // array to be updated later
    int24[6][6] distanceArray = [[infi,int24(1702),int24(2560),infi,int24(2560),int24(1702)],
        [int24(1702),infi,int24(1381),int24(2730),infi,int24(3161)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)]
    ];

    int24[6][6] costArray = [[infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)],
        [infi,int24(1),int24(1),int24(1),int24(1),int24(1)]
    ];

    // function to fetch the updated Distance Array
    function getMatrixDistance() public view returns(int24[6][6] memory){
        return distanceArray;
    }

    // function to fetch the updated Cost Array
    function getMatrixCost() public view returns(int24[6][6] memory){
        return costArray;
    }

    // function to update the Cost matrix and return an generated orderID
    uint cost = 1; // dummy cost for adding to payment_due_to_each_drone

    function updateCostMatrix(uint[2][] memory pairs) public payable returns(uint){
        orderID++;
        uint arrLen = pairs.length;
        uint[6] memory tempPay;

        for(uint i = 0; i<6; i++){
            tempPay[i] = 0;
        }

        for(uint i = 0; i<arrLen; i++){
            uint x = uint(pairs[i][0]);
            uint y = uint(pairs[i][1]);
            costArray[x][y] = int24(costArray[x][y]) + 300; // increasing price by 20%
            costArray[y][x] = int24(costArray[y][x]) + 300; // increasing price by 20%
            //Let's assume 'cost' is being added to due paymeny array for this transaction
            tempPay[x] = uint(costArray[x][y]) - 300;
        }
        paymentDue[orderID] = tempPay;
        //paymentOrderIDs.push(orderID);
        return orderID;
    }
    /*
    function findIndex(uint[] memory arr, uint ele) public pure returns(uint){
        uint arrLen = arr.length;
        for(uint i = 0; i<arrLen; i++){
            if(arr[i] == ele){
                return i;
            }
        }
    }
    // Function to delete an orderID from paymentOrderIDs array;
    function deleteElement(uint _orderID) public{
        uint index = findIndex(paymentOrderIDs, _orderID);
        if (index >= paymentOrderIDs.length) return;

        for (uint i = index; i<paymentOrderIDs.length-1; i++){
            paymentOrderIDs[i] = paymentOrderIDs[i+1];
        }
        delete paymentOrderIDs[paymentOrderIDs.length-1];
        paymentOrderIDs.length--;
    }
    */
    function delieveryComplete(uint _orderID, uint[2][] memory pairs) public returns(string memory){
        //deleteElement(_orderID);
        uint arrLen = pairs.length;
        for(uint i = 0; i<arrLen; i++){
            uint x = uint(pairs[i][0]);
            uint y = uint(pairs[i][1]);
            costArray[x][y] = int24(costArray[x][y]) - 300; // increasing price by 20%
            costArray[y][x] = int24(costArray[y][x]) - 300; // increasing price by 20%
        }
        uint[6] memory temp = paymentDue[_orderID];
        for(uint i = 0; i<6; i++){
            if(temp[i] != 0){
                droneAddress[i].transfer(temp[i]);
            }
        }
        return "Ho gaya BC !!!";
    }
}