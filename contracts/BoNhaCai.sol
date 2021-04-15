// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CustomERC20.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";



abstract contract checkResultInterface {
    function checkResult(uint ticketId) public view virtual returns (uint256);
}

abstract contract checkTicketBuyInterface {
    function checkTicketBuy(uint roundId, uint256 _data) public view virtual returns (bool);
}

abstract contract checkRoundCreateInterface {
    function checkRoundCreate(uint256 _data, uint _endtime) public view virtual returns (bool);
}

contract BoNhaCai is CustomERC20, ReentrancyGuard{
    uint256 public token_price;
    address private admin;
    
    constructor(uint256 _price) CustomERC20("Chip", "CHI") {
        admin = msg.sender;
        token_price = _price;
    }

    struct Ticket {
        uint256 data;
        uint256 ticketPrice;
        uint256 roundId;
        bool used;
    }

    struct Round {
        uint256 data;
        uint256 endTime;
        address resultContract;
        uint256[] ticketIds;
    }

    Ticket[] public tickets;
    Round[] public rounds;

    mapping(uint256 => uint256) private _balanceOfRounds;

    mapping(uint256 => address) private _roundOwners;

    mapping(uint256 => address) private _ticketOwners;

    event NewRound(address owner, address resultContract, uint256 endTime, uint balance);

    function getAdmin() view public returns(address){
        return admin;
    }

    function setPriceToken(uint256 _newPrice) public {
        require(msg.sender == admin);
        token_price = _newPrice;
    }

    function getRound(uint256 _roundId) public view returns(uint256 , uint256 , address , uint256[] memory) {    
        require(_roundExists(_roundId));    
        return (rounds[_roundId].data, rounds[_roundId].endTime, rounds[_roundId].resultContract, rounds[_roundId].ticketIds);
    } 

    function getTicket(uint256 _ticketId) public view returns(uint256 , uint256 , uint256 , bool){
        require(_ticketExists(_ticketId));
        return (tickets[_ticketId].data, tickets[_ticketId].ticketPrice, tickets[_ticketId].roundId, tickets[_ticketId].used);
    }

    function createRound(
        uint256 _data,
        address _resultContract,
        uint256 _endTime,
        uint256 _balance
    ) external returns (uint256){
        require(checkRoundCreateInterface(_resultContract).checkRoundCreate(_data, _endTime));
        Round memory newRound;
        newRound.endTime = _endTime;
        newRound.resultContract = _resultContract;
        newRound.data = _data;
        rounds.push(newRound);
        uint roundId = rounds.length-1;
        _roundOwners[roundId] = msg.sender;
        _transferToRound(msg.sender, roundId, _balance);
        //emit NewRound(msg.sender, _resultContract, _endTime, _balance);
        return roundId;
    }

    function buyTicket(   
        uint256 _data,
        uint256 _price,
        uint256 _roundId
    ) external returns (uint256){
        require(_roundExists(_roundId), "Operator query for nonexistent round");
        require(checkTicketBuyInterface(rounds[_roundId].resultContract).checkTicketBuy(_roundId, _data));
        _transferToRound(msg.sender, _roundId, _price);
        Ticket memory newTicket = Ticket(_data, _price, _roundId, false);
        tickets.push(newTicket);
        uint ticketId = tickets.length - 1;
        rounds[_roundId].ticketIds.push(ticketId);
        _ticketOwners[ticketId] = msg.sender;
        return ticketId;
    }

    function _transferToRound(
        address _sender,
        uint256 _roundId,
        uint256 _amount
    ) internal {
        require(_sender != address(0), "ERC20: transfer from the zero address");
        require(_roundExists(_roundId), "Operator query for nonexistent round");

        uint256 senderBalance = _balances[_sender];
        require(senderBalance >= _amount, "ERC20: transfer amount exceeds balance");
        _balances[_sender] = senderBalance - _amount;
        _balanceOfRounds[_roundId] += _amount;
    }

    function _transferFromRound(
        address _recipient,
        uint256 _roundId,
        uint256 _amount
    ) internal {
        require(
            _recipient != address(0),
            "ERC20: transfer to the zero address"
        );
        require(_roundExists(_roundId), "Operator query for nonexistent round");

        uint256 senderBalance = _balanceOfRounds[_roundId];
        require(
            senderBalance >= _amount,
            "ERC20: transfer amount exceeds balance"
        );
        _balanceOfRounds[_roundId] = senderBalance - _amount;
        _balances[_recipient] += _amount;
    }

    function withDrawTicket (uint ticketId) external nonReentrant{
        require(_ticketOwners[ticketId]==msg.sender);
        require(!tickets[ticketId].used);
        uint256 roundId = tickets[ticketId].roundId;
        uint256 winChip;
        winChip = ticketWinChip(ticketId);
        if(winChip == 0){
            _disableTicket(ticketId);
        }
        else{
            uint256 roundBalance = _balanceOfRounds[roundId];
            if(winChip >= roundBalance){
                _transferFromRound(msg.sender, roundId, winChip);
            }
            else{
                if(roundBalance!=0){
                    _transferFromRound(msg.sender, roundId, roundBalance);
                }              
                _approve(_roundOwners[roundId], msg.sender, roundBalance-winChip);
            }
            _disableTicket(ticketId);
        }
    }

    function sumOfWinnerChipOfRound(uint roundId) view public returns (uint256){
        uint sumOfWinChip = 0;
        uint i = 0;
        address resultContract = rounds[roundId].resultContract;
        for(i;i<rounds[roundId].ticketIds.length;i++){
            if(!tickets[rounds[roundId].ticketIds[i]].used)
                sumOfWinChip += checkResultInterface(resultContract).checkResult(rounds[roundId].ticketIds[i]);
        }
        return sumOfWinChip;
    }

    function withDrawRound(uint256 roundId) external nonReentrant{
        require(_roundOwners[roundId] == msg.sender);
        uint256 balance = _balanceOfRounds[roundId];
        uint256 sumOfWinChip = sumOfWinnerChipOfRound(roundId);
        if(balance > sumOfWinChip){
            _transferFromRound(msg.sender, roundId, balance - sumOfWinChip);
        }
    }

    function _roundExists(uint256 _roundId) internal view returns (bool) {
        return _roundOwners[_roundId] != address(0);
    }

    function _ticketExists(uint256 _ticketId) internal view returns (bool) {
        return _ticketOwners[_ticketId] != address(0);
    }

    function buyToken() public payable{
        require(msg.value >= token_price);
        _balances[msg.sender] += (msg.value/token_price);
    }

    function balanceOfRound(uint roundId) public view returns(uint256){
        return _balanceOfRounds[roundId];
    }

    function ticketToOwner(uint ticketId) public view returns(address) {
        return _ticketOwners[ticketId];
    }

    function ownerToTickets() public view returns(uint256[] memory){
        uint i = 0;
        uint j = 0;
        uint256[] memory tempTicketIds = new uint256[](tickets.length);
        for(i;i<tickets.length;i++){
            if(_ticketOwners[i]==msg.sender){
                tempTicketIds[j] = i;
                j++;
            }
        }
        uint256[] memory ticketIds = new uint256[](j);
        for(i=0;i<j;i++){
            ticketIds[i] = tempTicketIds[i];
        }
        return ticketIds;
    }

    function ownerToWinTickets() public view returns (uint256[] memory){
        uint i = 0;
        uint j = 0;
        uint256[] memory tempTicketIds = new uint256[](tickets.length);
        for(i;i<tickets.length;i++){
            if(_ticketOwners[i]==msg.sender){
                if(!tickets[i].used){
                    if(ticketWinChip(i)>0){
                        tempTicketIds[j] = i;
                        j++;
                    }
                }
            }
        }
        uint256[] memory ticketIds = new uint256[](j);
        for(i=0;i<j;i++){
            ticketIds[i] = tempTicketIds[i];
        }
        return ticketIds;
    }

    function roundToWinTickets(uint _roundId) public view returns (uint256[] memory){
        uint i = 0;
        uint j = 0;
        uint256[] memory tempTicketIds = new uint256[](rounds[_roundId].ticketIds.length);
        for(i;i<rounds[_roundId].ticketIds.length;i++){
            if(!tickets[rounds[_roundId].ticketIds[i]].used){
                if(ticketWinChip(rounds[_roundId].ticketIds[i])>0){
                    tempTicketIds[j] = i;
                    j++;
                }
            }
        }
        uint256[] memory ticketIds = new uint256[](j);
        for(i=0;i<j;i++){
            ticketIds[i] = tempTicketIds[i];
        }
        return ticketIds;
    }

    function ticketWinChip(uint256 ticketId) public view returns (uint256){
        uint256 roundId = tickets[ticketId].roundId;
        uint256 winChip;
        winChip = checkResultInterface(rounds[roundId].resultContract).checkResult(ticketId);
        return winChip;    
    }

    function roundToOwner(uint roundId) public view returns(address){
        return _roundOwners[roundId];
    }

    function ownerToRounds() public view returns(uint256[] memory){
        uint i = 0;
        uint j = 0;
        uint256[] memory tempRoundIds = new uint256[](rounds.length);
        for(i;i<rounds.length;i++){
            if(_roundOwners[i]==msg.sender){
                tempRoundIds[j] = i;
                j++;
            }
        }
        uint256[] memory roundIds = new uint256[](j);
        for(i=0;i<j;i++){
            roundIds[i] = tempRoundIds[i];
        }
        return roundIds;
    }

    function _disableTicket(uint256 ticketId) private {
        tickets[ticketId].used = true;
    }

    fallback () external payable{
        buyToken();
    }

    receive() external payable {
        buyToken();
    }
}
