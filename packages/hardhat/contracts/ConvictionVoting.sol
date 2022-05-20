// SPDX-License-Identifier: Apache-2.0
/**
                            ,*.
                          .**,
                          ,***.
                    .,.   ,***,
                  .**,    *****.
                .****.    ,*****,
              .******,     ,******,
            .*******.       .********,              .
          ,******.            .*************,,*****.
        ,*****.        ,,.        ,************,.
    .,****.         ,*****,
    ,***,          ,*******,.              ..
  ,**,          .*******,.       ,********.
              .******,.       .********,
            .*****,         .*******,
          ,****,          .******,
        ,***,.          .*****,
      ,**,.           ./***,
    ,,             .***,
                  .**,
                    Moonshot Collective
            https://github.com/moonshotcollective
*/
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";
import "./libs/ABDKMath64x64.sol";

/// @title Conviction Voting Contract
/// @author QEDK, Jaxcoder
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract ConvictionVoting is Ownable {
    using ABDKMath64x64 for uint256;
    using SafeERC20 for IERC20;
    using Arrays for uint256[];

    error BadGaugeId();
    error EmptyCount();

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

    uint256 public currentGaugeId;

    /// @notice Mapping of all gauges structs
    mapping(uint256 => Gauge) public gauges;

    /// @notice Mapping of conviction scores for a user
    mapping(address => uint256) public scores;

    IERC20 public token;

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

    constructor(IERC20 newToken, address owner) {
        token = newToken;
        _transferOwnership(owner);
    }

    /// @notice Adds a new gauge with no values
    function addGauge() external onlyOwner {
        uint256 current = ++currentGaugeId;
        Gauge storage gauge = gauges[current]; // gauges start from 1...
        gauge.id = current;

        emit NewGauge(current);
    }

    /// @notice Adds conviction to a gauge
    /// @param user the address of the user adding conviction
    /// @param gaugeId the id of the guage adding conviction to
    /// @param amount the amount of GTC being convicted => **not the weight of it**
    function addConviction(
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
        token.safeTransferFrom(user, address(this), amount);

        emit AddConviction(gaugeId, convictionId, user, amount);
    }

    /// @notice removes conviction by id(s)
    /// @param gaugeId the id of the gauge
    /// @param count ...
    /// @param oldestFirst should we use the oldest first?
    /// @param convictions array of conviction values
    function removeConvictionByIds(
        uint256 gaugeId,
        uint256 count,
        bool oldestFirst,
        address receiver,
        uint256[] calldata convictions
    ) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id != 0) revert BadGaugeId();
        if (count != 0) revert EmptyCount();
        uint256 returnAmount = 0;
        if (oldestFirst) {
            for (uint256 i = 0; i <= count; i++) {
                require(
                    gauge.convictions[convictions[i]].userAddress == msg.sender,
                    "ONLY_VOTER"
                );
                returnAmount += gauge.convictions[convictions[i]].amount;
                delete gauge.convictions[convictions[i]];
            }
            gauge.convictionsByUser[msg.sender] = uint256[](
                convictions[:count]
            );
        } else {
            for (
                uint256 i = convictions.length - 1;
                i >= convictions.length - count;
                i--
            ) {
                require(
                    gauge.convictions[convictions[i]].userAddress == msg.sender,
                    "ONLY_VOTER"
                );
                returnAmount += gauge.convictions[convictions[i]].amount;
                delete gauge.convictions[convictions[i]];
            }
            gauge.convictionsByUser[msg.sender] = uint256[](
                convictions[:count]
            );
        }
        token.safeTransfer(receiver, returnAmount);
    }

    /// @notice Remove all convictions for an address
    /// @param gaugeId Gauge id to calculate score for
    /// @param receiver Address to return tokens to
    function removeAllConvictions(uint256 gaugeId, address receiver) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id != 0) revert BadGaugeId();
        uint256 returnAmount = 0;
        uint256[] memory convictions = gauge.convictionsByUser[msg.sender];
        for (uint256 i = 0; i < convictions.length; i++) {
            returnAmount += gauge.convictions[convictions[i]].amount;
            delete gauge.convictions[convictions[i]];
        }
        delete gauge.convictionsByUser[msg.sender];
        token.safeTransfer(receiver, returnAmount);
    }

    /// @notice Calculate conviction score for a gauge
    /// @param gaugeId Gauge id to calculate score for
    /// @return score Calculated score
    function getConvictionScore(uint256 gaugeId)
        external
        view
        returns (uint256 score)
    {
        Gauge storage gauge = gauges[gaugeId];
        uint256 length = gauge.currentConvictionId;
        for (uint256 i = 0; i < length; i++) {
            Conviction memory conviction = gauge.convictions[i];
            if (conviction.userAddress == address(0)) {
                continue; // conviction was removed
            }
            uint256 x1 = conviction.amount.sqrtu();
            uint256 x2 = (block.timestamp - conviction.timestamp)**2;
            score += x1 * x2;
        }

        return score;
    }

    /// @notice Calculate conviction score for an user on a guauge
    /// @param gaugeId Gauge id to calculate score for
    /// @param user User address to calculate score for
    /// @return score Calculated score
    function getConvictionScore(uint256 gaugeId, address user)
        external
        view
        returns (uint256 score)
    {
        Gauge storage gauge = gauges[gaugeId];
        uint256[] memory convictions = gauge.convictionsByUser[user];
        for (uint256 i = 0; i < convictions.length; i++) {
            uint256 x1 = uint256(
                ABDKMath64x64.sqrtu(gauge.convictions[i].amount)
            );
            uint256 x2 = (block.timestamp - gauge.convictions[i].timestamp)**2;
            score += x1 * x2;
        }

        return score;
    }

    /// @notice get a users conviction score for a gauge
    /// @param gaugeId the id of the gauge
    /// @param user the address of the user
    function getIntArrayFromMappingForConvictionsByUser(
        uint256 gaugeId,
        address user
    ) public view returns (uint256[] memory) {
        Gauge storage gauge = gauges[gaugeId];
        // uint256[] memory covictions = gauge.convictionsByUser[gaugeId][_msgSender()];
        return gauge.convictionsByUser[user];
    }

    /// @notice get a total conviction score for a gauge
    /// @param gaugeId the id of the gauge
    function getIntFromMappingForTotalConvictionForGauge(uint256 gaugeId)
        public
        view
        returns (uint256)
    {
        Gauge storage gauge = gauges[gaugeId];
        Conviction storage convictions = gauge.convictions[gaugeId];
        uint256 convictionTotalForGuage = 0;
        //for(uint i = 0; i < gauge.convictions[gaugeId].length; i++) {
        // add them upp
        //}

        return convictionTotalForGuage;
    }
}
