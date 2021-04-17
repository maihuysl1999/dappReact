// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BoNhaCai.sol";

contract SimpleLottery {
    address public BoNhaCaiAddr;
    BoNhaCai boNhaCai;

    event Result(uint roundId, uint value);

    mapping(uint256 => uint256) public winners;

    constructor(address addr) {
        BoNhaCaiAddr = addr;
        boNhaCai = BoNhaCai(payable(addr));
    }

    function Now() public view returns (uint256) {
        return block.timestamp;
    }

    function drawWinner(uint256 roundId) public {
        require(winners[roundId] == 0);
        uint256[] memory ticketIds;
        uint256 data;
        uint256 endTime;
        address resultContract;
        (data, endTime, resultContract, ticketIds) = boNhaCai.getRound(roundId);

        require(block.timestamp > endTime);

        bytes32 rand = keccak256(abi.encode(blockhash(block.number - 1)));
        uint result = (uint256(rand) % ticketIds.length) + 1;
        winners[roundId] = result;
        emit Result(roundId, result);

    }

    function checkResult(uint256 ticketId)
        external
        view
        virtual
        returns (uint256)
    {
        uint256 data;
        uint256 ticketPrice;
        uint256 roundId;
        bool used;
        (data, ticketPrice, roundId, used) = boNhaCai.getTicket(ticketId);
        if (ticketId == winners[roundId] - 1) {
            return boNhaCai.balanceOfRound(roundId);
        } else {
            return 0;
        }
    }

    function checkTicketBuy(
        uint256 roundId,
        uint256 _data,
        uint256 _ticketPrice
    ) public view virtual returns (bool) {
        uint256 data;
        uint256 endTime;
        (data, endTime, , ) = boNhaCai.getRound(roundId);
        if (
            (endTime > block.timestamp) &&
            (winners[roundId] == 0) &&
            (_ticketPrice == data)
        ) return true;
        else return false;
    }

    function checkRoundCreate(uint256 _data, uint256 _endTime)
        public
        view
        virtual
        returns (bool)
    {
        if (_endTime > block.timestamp) return true;
        else return false;
    }
}
