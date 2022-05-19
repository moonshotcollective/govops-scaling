pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "forge-std/Test.sol";

import {ConvictionVoting} from "contracts/ConvictionVoting.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "contracts/libs/ABDKMath64x64.sol";

contract ConvictionVotingTest is Test, Ownable {
    using SafeERC20 for IERC20;

    ConvictionVoting private convictionVoting;

    IERC20 token;

    error BadGaugeId();
    error EmptyCount();

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

    function testAddConviction(
        address user,
        uint256 gaugeId,
        uint256 amount
    ) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id != 0) revert BadGaugeId();
        uint256 convictionId = gauge.currentConvictionId++; // convictionId starts from 0...
        Conviction storage convictions = gauge.convictions[convictionId];
        convictions.userAddress = user;
        convictions.amount = amount;
        convictions.timestamp = block.timestamp;
        gauge.convictionsByUser[user].push(convictionId);
        // token.safeTransferFrom(user, address(this), amount);

        emit AddConviction(gaugeId, convictionId, user, amount);
    }

    function testCalculateConvictionScore(uint256 gaugeId)
        external
        view
        returns (uint256 score)
    {
        Gauge storage gauge = gauges[gaugeId];
        for (uint256 i = 0; i < gauge.currentConvictionId; i++) {
            uint256 x1 = uint256(
                ABDKMath64x64.sqrtu(gauge.convictions[i].amount)
            );
            uint256 x2 = (block.timestamp - gauge.convictions[i].timestamp)**2;
            score += x1 * x2;
        }

        return score;
    }

    function testCalculateMinimumConviction(
        uint256 gaugeId
    )
        external
        view
        returns(uint256)
    {
        uint256 convictionReqd = 0;

        return convictionReqd;
    }

    /// @notice index out of bounds error
    // function testRemoveConvictionByIds(
    //     uint256 gaugeId,
    //     uint256 count,
    //     bool oldestFirst,
    //     uint256[] calldata convictions
    // ) external {
    //     Gauge storage gauge = gauges[gaugeId];
    //     if (gauge.id != 0) revert BadGaugeId();
    //     if (count != 0) revert EmptyCount();
    //     uint256 returnAmount = 0;
    //     if (oldestFirst) {
    //         for (uint256 i = 0; i <= count; i++) {
    //             require(
    //                 gauge.convictions[convictions[i]].userAddress ==
    //                     _msgSender(),
    //                 "ONLY_VOTER"
    //             );
    //             returnAmount += gauge.convictions[convictions[i]].amount;
    //             delete gauge.convictions[convictions[i]];
    //         }
    //         gauge.convictionsByUser[_msgSender()] = uint256[](
    //             convictions[:count]
    //         );
    //     } else {
    //         for (
    //             uint256 i = convictions.length - 1;
    //             i >= convictions.length - count;
    //             i--
    //         ) {
    //             require(
    //                 gauge.convictions[convictions[i]].userAddress ==
    //                     _msgSender(),
    //                 "ONLY_VOTER"
    //             );
    //             returnAmount += gauge.convictions[convictions[i]].amount;
    //             delete gauge.convictions[convictions[i]];
    //         }
    //         gauge.convictionsByUser[_msgSender()] = uint256[](
    //             convictions[:count]
    //         );
    //     }
    //     // token.safeTransfer(_msgSender(), returnAmount);
    // }
}
