// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BoNhaCai.sol";

contract SimpleLottery {
    address public BoNhaCaiAddr;
    BoNhaCai boNhaCai;

    mapping(uint=>uint) public winners;

    constructor (address addr) {
        BoNhaCaiAddr = addr;
        boNhaCai = BoNhaCai(payable(addr));
    }
    function Now() public view returns(uint256){
        return block.timestamp;
    }

    function drawWinner (uint roundId) public {
        require(winners[roundId]==0);
        uint256[] memory ticketIds;
        uint256 data;
        uint256 endTime;
        address resultContract; 
        (data,endTime,resultContract,ticketIds) = boNhaCai.getRound(roundId);

        require(block.timestamp > endTime);

        bytes32 rand = keccak256(abi.encode(blockhash(block.number-1)));
        winners[roundId] = uint(rand) % ticketIds.length + 1;
    }

    function checkResult(uint ticketId) external view virtual returns (uint256){
        uint256 data;
        uint256 ticketPrice;
        uint256 roundId;
        bool used;
        (data, ticketPrice, roundId, used) = boNhaCai.getTicket(ticketId);
        if(ticketId == winners[roundId]-1){
            return boNhaCai.balanceOfRound(roundId);
        }
        else {
            return 0;
        }
    }

    function checkTicketBuy(uint roundId, uint256 _data) public view virtual returns (bool){
        uint256[] memory ticketIds;
        uint256 data;
        uint256 endTime;
        address resultContract; 
        (data,endTime,resultContract,ticketIds) = boNhaCai.getRound(roundId);
        require(endTime > block.timestamp);
        require(winners[roundId]==0);
        return true;
    }

    function checkRoundCreate(uint _data, uint256 _endTime) public view virtual returns (bool){
        require(_endTime>block.timestamp, "ngu");
        return true;
    }
}