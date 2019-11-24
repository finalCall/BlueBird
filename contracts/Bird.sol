pragma solidity >=0.4.21 <0.6.0;

contract bird{
    int _ = int(-1);
    uint orderID = 0;
    address payable[] droneAddress = [0x086C9A35245cC1198440236665c8134e9FeD3D26,
        0xa736FeD8e0C2F6317898E7090e57bBA2bB7c7D4b,
        0x237799f9BE53976381eE1b2c2D5006DD23E3576b,
        0x66B327C0Bd326c0ad748AeF5CF1CCB67F1012e29,
        0x4E231D5BC3f18136f30120d98A78b8A22a2D2993,
        0x7E65A2094a0048f48762C7e8E3C2d1348948aEf7
    ];

    //mnemonics : board weasel tip physical alien charge exhaust exclude approve cabin frost excite
    mapping(address => uint256[6]) paymentDue; // mapping from orderID to payment_due_to_each_drone
    //uint[] paymentOrderIDs;

    // array to be updated later
    int[6][6] distanceArray = [[_,int(1702),int(2560),_,int(2560),int(1702)],
        [int(1702),_,int(1381),int(2730),_,int(3161)],
        [int(2560),int(1381),_,int(1792),int(3162),_],
        [_,int(2730),int(1792),_,int(1792),int(2730)],
        [int(2560),_,int(3162),int(1792),_,int(1382)],
        [int(1702),int(3161),_,int(2730),int(1381),_]
    ];

    int[6][6] costArray = [[_, int(500), int(1500), _, int(1500), int(500)],
        [int(500), _, int(500), int(1500), _, int(1500)],
        [int(1500), int(500), _, int(500), int(1500), _],
        [_, int(1500), int(500), _, int(500), int(1500)],
        [int(1500), _, int(1500), int(500), _, int(500)],
        [int(500), int(1500), _, int(1500), int(500), _]
    ];

    // Events to place and release the orders
    event orderPlaced(address addr);
    event releaseAmount(address addr);

    // function to fetch the updated Distance Array
    function getMatrixDistance() public view returns(int[6][6] memory){
        return distanceArray;
    }

    // function to fetch the updated Cost Array
    function getMatrixCost() public view returns(int[6][6] memory){
        return costArray;
    }

    // function to update the Cost matrix and return an generated orderID
    function updateCostMatrix(uint[2][] memory pairs) public payable{
        uint arrLen = pairs.length;
        uint[6] memory tempPay;

        for(uint i = 0; i<6; i++){
            tempPay[i] = 0;
        }

        for(uint i = 0; i<arrLen; i++){
            uint x = uint(pairs[i][0]);
            uint y = uint(pairs[i][1]);
            tempPay[x] = uint(costArray[x][y] / 500);
            costArray[x][y] = int(costArray[x][y]) + 500; // increasing price by 300
            costArray[y][x] = int(costArray[y][x]) + 500; // increasing price by 300
        }
        paymentDue[msg.sender] = tempPay;
        //paymentOrderIDs.push(orderID);
        emit orderPlaced(msg.sender);
    }
    //function to release the amount associated with the given
    function deliveryComplete(address _orderID, uint[2][] memory pairs) public payable{
        //deleteElement(_orderID);
        uint arrLen = pairs.length;
        for(uint i = 0; i<arrLen; i++){
            uint x = uint(pairs[i][0]);
            uint y = uint(pairs[i][1]);
            costArray[x][y] = int(costArray[x][y]) - 500; // decreasing price by 300
            costArray[y][x] = int(costArray[y][x]) - 500; // decreasing price by 300
        }
        uint256[6] memory temp = paymentDue[_orderID];
        for(uint i = 0; i<6; i++){
            if(temp[i] != 0){
                droneAddress[i].transfer(temp[i]);
            }
        }
        emit releaseAmount(_orderID);
    }
    //function to fetch the account details
    function getAccountDetails() public view returns (address payable, uint256, uint256){
        return (msg.sender, msg.sender.balance, address(this).balance);
    }
}