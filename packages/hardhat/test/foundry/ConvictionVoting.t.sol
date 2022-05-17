pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "forge-std/Test.sol";

import { ConvictionVoting } from "contracts/ConvictionVoting.sol";

contract ConvictionVotingTest is Test {
    ConvictionVoting private convictionVoting;

    event NewGauge(uint256 indexed id);
    event AddConviction(
        uint256 indexed gaugeId,
        uint256 indexed convictionId,
        address indexed user,
        uint256 amount
    );
    event RemoveConviction(
        uint256 indexed gaugeId,
        uint256 indexed convictionId,
        address indexed user,
        uint256 amount
    );
    event RemoveConviction(
        uint256 indexed gaugeId,
        address indexed user,
        uint256 indexed amount
    );

    struct Gauge {
        uint256 id;
        uint256 currentConvictionId;
        mapping(uint256 => Conviction) convictions;
        mapping(address => uint256[]) convictionsByUser;
    }

    struct Conviction {
        address userAddress;
        uint256 amount;
        uint256 timestamp;
    }

    uint256 currentGaugeId;

    mapping(uint256 => Gauge) public gauges;

    function testAddGauge() external {
        uint256 current = ++currentGaugeId;
        Gauge storage gauge = gauges[current]; // gauges start from 1...
        gauge.id = current;

        emit NewGauge(current);
    }

    // ...
}