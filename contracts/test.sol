pragma solidity >=0.4.21 <0.6.0;

contract test{
    uint num;
    function dummy()external payable returns(uint){
        num = msg.value;
        return num;
    }
}