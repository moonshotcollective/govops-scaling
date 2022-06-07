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
pragma solidity ^0.8.14;

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
        uint256 totalStake;
        uint256 threshold;
        mapping(uint256 => Conviction) convictions;
        mapping(address => uint256[]) convictionsByUser;
    }

    struct Conviction {
        address userAddress;
        uint256 amount;
        uint256 timestamp;
    }

    uint256 public currentGaugeId;
    uint256 public convictionThreshold;
    uint256 public effectiveSupply;
    uint256 public minimumConviction;

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

    constructor(address newToken, address owner) {
        token = IERC20(newToken);
        _transferOwnership(owner);
    }

    /// @notice Adds a new gauge with no convictions
    function addGauge() external onlyOwner {
        uint256 current = ++currentGaugeId;
        Gauge storage gauge = gauges[current]; // gauges start from 1...
        gauge.id = current;

        emit NewGauge(current);
    }

    /// @notice Adds a new gauge with a threshold
    function addGauge(uint256 threshold) external onlyOwner {
        uint256 current = ++currentGaugeId;
        Gauge storage gauge = gauges[current]; // gauges start from 1...
        gauge.id = current;
        gauge.threshold = threshold;

        emit NewGauge(current);
    }

    /// @notice Adds conviction to a gauge
    /// @param user The address of the user adding conviction
    /// @param gaugeId The ID of the gauge where the user is adding their conviction
    /// @param amount The amount of GTC being added as conviction (not the weight/score)
    function addConviction(
        address user,
        uint256 gaugeId,
        uint256 amount
    ) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id == 0) revert BadGaugeId();
        uint256 convictionId = gauge.currentConvictionId++; // convictionId starts from 0...
        Conviction storage convictions = gauge.convictions[convictionId];
        convictions.userAddress = user;
        convictions.amount = amount;
        // solhint-disable-next-line not-rely-on-time
        convictions.timestamp = block.timestamp;
        gauge.convictionsByUser[user].push(convictionId);
        gauge.totalStake += amount;
        token.safeTransferFrom(user, address(this), amount);

        emit AddConviction(gaugeId, convictionId, user, amount);
    }

    /// @notice removes conviction by id(s)
    /// @param gaugeId The ID of the gauge
    /// @param count Number of convictions to remove
    /// @param oldestFirst Start removing from the left of the conviction array
    /// @param convictions Array of current conviction values
    /// @dev We use the existing array as calldata to remove some pesky SLOADs, take care to be accurate!
    function removeConvictionByIds(
        uint256 gaugeId,
        uint256 count,
        bool oldestFirst,
        address receiver,
        uint256[] calldata convictions // where does this come from?
    ) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id == 0) revert BadGaugeId();
        if (count == 0) revert EmptyCount();
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

    /// @notice Remove conviction by amount
    /// @param gaugeId The ID of the gauge
    /// @param receiver Address to refund convicted tokens
    /// @param convictions Array of current conviction values
    /// @dev We use the existing array as calldata to remove some pesky SLOADs, take care to be accurate!
    function removeConvictionByAmount(
        uint256 gaugeId,
        uint256 amount,
        address receiver,
        uint256[] calldata convictions
    ) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id != 0) revert BadGaugeId();
        uint256 convictionRemoved = 0;
        uint256 idx = 0;
        for (uint256 i = 0; i < convictions.length; i++) {
            Conviction memory conviction = gauge.convictions[convictions[i]];
            require(conviction.userAddress == msg.sender, "ONLY_VOTER");
            convictionRemoved += conviction.amount;
            if (convictionRemoved == amount) {
                delete gauge.convictions[convictions[i]];
                idx = i;
                break;
            } else if (convictionRemoved > amount) {
                gauge.convictions[convictions[i]].amount =
                    convictionRemoved -
                    amount;
                idx = i + 1;
                break;
            }
            delete gauge.convictions[convictions[i]];
        }
        gauge.convictionsByUser[msg.sender] = uint256[](convictions[:idx]);
        token.safeTransfer(receiver, amount);
    }

    /// @notice Remove all convictions for an address
    /// @param gaugeId Gauge id to calculate score for
    /// @param receiver Address to return tokens to
    function removeAllConvictions(uint256 gaugeId, address receiver) external {
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.id == 0) revert BadGaugeId();
        uint256 returnAmount = 0;
        uint256[] memory convictions = gauge.convictionsByUser[msg.sender];
        for (uint256 i = 0; i < convictions.length; i++) {
            returnAmount += gauge.convictions[convictions[i]].amount;
            gauge.totalStake -= returnAmount;
            delete gauge.convictions[convictions[i]];
        }
        delete gauge.convictionsByUser[msg.sender];
        token.safeTransfer(receiver, returnAmount);
    }

    /// @notice Get the score for a gauge
    /// @param gaugeId the id of the gauge
    /// @return totalStaked Total staked for specified gauge
    function totalStakedForGauge(uint256 gaugeId)
        external
        view
        returns (uint256 totalStaked)
    {
        Gauge storage gauge = gauges[gaugeId];

        totalStaked = gauge.totalStake;

        return totalStaked;
    }

    /// @notice Calculate conviction score for an user on a gauge
    /// @param gaugeId Gauge id to calculate score for
    /// @param user User address to calculate score for
    /// @return score Calculated score for specified user
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
            // solhint-disable-next-line not-rely-on-time
            uint256 x2 = (block.timestamp - gauge.convictions[i].timestamp)**2;
            score += x1 * x2;
        }

        return score;
    }

    function getGaugeDetails(uint256 gaugeId)
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        Gauge storage gauge = gauges[gaugeId];

        return (gauge.currentConvictionId, gauge.totalStake, gauge.threshold);
    }

    /// @notice get a users conviction score for a gauge
    /// @param gaugeId the id of the gauge
    /// @param user the address of the user
    /// @return userCovictions the users convictions for a gauge
    function getConvictionsByUser(uint256 gaugeId, address user)
        external
        view
        returns (uint256[] memory userCovictions)
    {
        Gauge storage gauge = gauges[gaugeId];
        return gauge.convictionsByUser[user];
    }

    /// @notice Get a user's staked amount
    /// @param gaugeId the ID of the gauge
    /// @param user The address of the user
    /// @return stake The user's total stake for a gauge in token units
    function getStakeByUser(uint256 gaugeId, address user)
        external
        view
        returns (uint256 stake)
    {
        Gauge storage gauge = gauges[gaugeId];
        uint256[] memory convictionIds = gauge.convictionsByUser[user];
        uint256 length = convictionIds.length;
        for (uint256 i = 0; i < length; ++i) {
            Conviction memory conviction = gauge.convictions[convictionIds[i]];
            stake += conviction.amount;
        }
    }

    // solhint-disable-next-line not-rely-on-time

    /// @notice Calculates the minimum conviction a user can commit
    /// @return convictionReqd The amount of tokens required to add conviction to a gauge
    function calculateMinimumConviction(
        uint256 /* gaugeId */
    ) external pure returns (uint256) {
        uint256 convictionReqd = 0;

        return convictionReqd;
    }

    /// @notice Returns if gauge is executable
    /// @param gaugeId the id of the gauge
    /// @return bool If the gauge is executable
    function isGaugeExecutable(uint256 gaugeId) external view returns (bool) {
        return percentOfThreshold(gaugeId) >= 10000;
    }

    /// @notice Calculate conviction score for a gauge
    /// @param gaugeId Gauge id to calculate score for
    /// @return score Total calculated score for gauge
    function getConvictionScoreForGauge(uint256 gaugeId)
        public
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
            // solhint-disable-next-line not-rely-on-time
            uint256 x2 = (block.timestamp - conviction.timestamp)**2;
            score += x1 * x2;
        }

        return score;
    }

    /// @notice Returns the current conviction score as a percentage of the defined threshold at two decimal places
    /// @dev If the calculated percetage is 0.05% This function will return 5, if less than 0.01% it will return 0.
    /// @param gaugeId the id of the gauge
    /// @return uint256 The percentage of current conviction score / threshold
    function percentOfThreshold(uint256 gaugeId) public view returns (uint256) {
        uint256 multiplier = 10000;
        Gauge storage gauge = gauges[gaugeId];
        if (gauge.threshold == 0) {
            return multiplier; // gauges with no thresholds are always executable, might want to distinguish in UI
        }
        uint256 totalScore = getConvictionScoreForGauge(gaugeId);
        return (totalScore * multiplier) / gauge.threshold;
    }
}
