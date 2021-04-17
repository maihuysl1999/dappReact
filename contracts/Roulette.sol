// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BoNhaCai.sol";

contract Roulette {
    uint256 public constant TYPE_NUM = 0;

    uint256 public constant TYPE_COLOR = 1;

    uint256 public constant TYPE_ODD_EVEN = 2;

    uint256 public constant TYPE_12 = 3;

    uint256 public constant TYPE_18 = 4;

    uint256 public constant TYPE_3_MODULO = 5;

    uint256 public constant NUM_POCKETS = 37;

    uint8[18] public RED_NUMBERS = [
        1,
        3,
        5,
        7,
        9,
        12,
        14,
        16,
        18,
        19,
        21,
        23,
        25,
        27,
        30,
        32,
        34,
        36
    ];
    uint8[18] public BLACK_NUMBERS = [
        2,
        4,
        6,
        8,
        10,
        11,
        13,
        15,
        17,
        20,
        22,
        24,
        26,
        28,
        29,
        31,
        33,
        35
    ];
    // maps wheel numbers to colors
    mapping(uint256 => uint256) public COLORS;

    address public BoNhaCaiAddr;
    BoNhaCai boNhaCai;

    mapping(uint256 => uint256) public winners;

    constructor(address addr) {
        for (uint256 i = 0; i < 18; i++) {
            COLORS[RED_NUMBERS[i]] = 1;
        }
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
        winners[roundId] = (uint256(rand) % NUM_POCKETS) + 1;
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
        if (winners[roundId] == 0) return 0;
        uint256 landed = winners[roundId] - 1;

        uint256 betType = getBetType(data);
        uint256 betValue = getBetValue(data);
        if (betType == TYPE_NUM) {
            if (betValue == landed) {
                return ticketPrice * 36;
            } else return 0;
        } else if (betType == TYPE_12) {
            if (landed == 0) return 0;
            else if (betValue == landed / 12) {
                return ticketPrice * 3;
            } else return 0;
        } else if (betType == TYPE_18) {
            if (landed == 0) return 0;
            else if (betValue == landed / 18) {
                return ticketPrice * 2;
            } else return 0;
        } else if (betType == TYPE_3_MODULO) {
            if (landed == 0) return 0;
            else if (betValue == landed % 3) {
                return ticketPrice * 3;
            } else return 0;
        } else if (betType == TYPE_COLOR) {
            if (landed == 0) return 0;
            else if (betValue == COLORS[landed]) {
                return ticketPrice * 2;
            } else return 0;
        } else if (betType == TYPE_ODD_EVEN) {
            if (landed == 0) return 0;
            else if (betValue == landed % 2) {
                return ticketPrice * 2;
            } else return 0;
        } else {
            return 0;
        }
    }

    function checkTicketBuy(uint256 roundId, uint256 _data)
        public
        view
        virtual
        returns (bool)
    {
        uint256 data;
        uint256 endTime;
        (data, endTime,,) = boNhaCai.getRound(roundId);
        require(endTime > block.timestamp);
        require(winners[roundId] == 0);
        require(checkBetData(_data));
        return true;
    }

    function checkBetData(uint256 data) public pure returns (bool) {
        uint256 betType = getBetType(data);
        uint256 betValue = getBetValue(data);
        if (betType == TYPE_NUM) {
            if (betValue >= 0 && betValue < 37) {
                return true;
            } else return false;
        } else if (betType == TYPE_12) {
            if (betValue >= 0 && betValue < 3) {
                return true;
            } else return false;
        } else if (betType == TYPE_18) {
            if (betValue >= 0 && betValue < 2) {
                return true;
            } else return false;
        } else if (betType == TYPE_3_MODULO) {
            if (betValue >= 0 && betValue < 3) {
                return true;
            } else return false;
        } else if (betType == TYPE_COLOR) {
            if (betValue >= 0 && betValue < 2) {
                return true;
            } else return false;
        } else if (betType == TYPE_ODD_EVEN) {
            if (betValue >= 0 && betValue < 2) {
                return true;
            } else return false;
        } else {
            return false;
        }
    }

    function getBetType(uint256 data) public pure returns (uint256) {
        return (data << 192) >> 192;
    }

    function getBetValue(uint256 data) public pure returns (uint256) {
        return ((data >> 64) << 192) >> 192;
    }

    function checkRoundCreate(uint256 _data, uint256 _endTime)
        public
        view
        virtual
        returns (bool)
    {
        require(_endTime > block.timestamp, "ngu");
        return true;
    }
}
