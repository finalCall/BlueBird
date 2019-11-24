
if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
    ethereum.enable();
}
else {    
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var accountBox = document.getElementById("accounts");
accountBox.addEventListener('change', () => {
  web3.eth.defaultAccount = web3.eth.accounts[accountBox.value];
})
web3.eth.defaultAccount = web3.eth.accounts[0];

var CoursetroContract = web3.eth.contract([
    {
      "constant": true,
      "inputs": [],
      "name": "getMatrixDistance",
      "outputs": [
        {
          "internalType": "int256[6][6]",
          "name": "",
          "type": "int256[6][6]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getMatrixCost",
      "outputs": [
        {
          "internalType": "int256[6][6]",
          "name": "",
          "type": "int256[6][6]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256[2][]",
          "name": "pairs",
          "type": "uint256[2][]"
        }
      ],
      "name": "updateCostMatrix",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderID",
          "type": "uint256"
        },
        {
          "internalType": "uint256[2][]",
          "name": "pairs",
          "type": "uint256[2][]"
        }
      ],
      "name": "deliveryComplete",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]);

var Coursetro = CoursetroContract.at('0x05727aCE261c4DcD46A57C596186BedbcA2099bc'); // to be updated later

/*
for(var i=0; i<6; i++){
    var send = web3.eth.accounts[i].toString();
    var res = Coursetro.addDroneAddr(send,i);
    console.log(res + " " + i);
}*/
