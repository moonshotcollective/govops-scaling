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
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Arrays.sol";

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract ConvictionVoting is Ownable {
    using SafeERC20 for IERC20;
    using Arrays for uint256[];

    struct Gauge {
        uint256 id;
        uint256 currentConvictionId;
        mapping(uint256 => Conviction) conviction;
        mapping(uint256 => mapping(address => uint256[])) convictionsByUser;
    }

    struct Conviction {
        address userAddress;
        uint256 amount;
        uint256 timestamp;
    }

    uint256 currentGaugeId;

    /// @dev Mapping of all gauges structs
    mapping(uint256 => Gauge) public gauges;

    /// @dev Mapping of conviction scores for a user
    mapping(address => uint256) public scores;

    IERC20 token;

    event NewGauge(uint256 indexed id);
    event AddConviction(
        uint256 indexed gaugeId,
        uint256 indexed convictionId,
        address indexed user,
        uint256 indexed amount
    );
    event RemoveConviction(
        uint256 indexed gaugeId,
        uint256 indexed convictionId,
        address indexed user,
        uint256 indexed amount
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

    /// @dev Adds a new gauge with no values
    function addGauge() external onlyOwner {
        uint256 current = ++currentGaugeId;
        Gauge storage gauge = gauges[current]; // gauges start from 1...
        gauge.id = current;

        emit NewGauge(current);
    }

    /// @dev Adds conviction to a gauge
    /// @param user the address of the user adding conviction
    /// @param gaugeId the id of the guage adding conviction to
    /// @param amount the amount of GTC being convicted => **not the weight of it**
    function addConviction(
        address user,
        uint256 gaugeId,
        uint256 amount
    ) external {
        Gauge storage gauge = gauges[gaugeId];
        require(gauge.id != 0, "NONEXISTENT_GAUGE");
        uint256 convictionId = gauge.currentConvictionId++; // convictionId starts from 0...
        Conviction storage conviction = gauge.conviction[convictionId];
        conviction.userAddress = user;
        conviction.amount = amount;
        conviction.timestamp = block.timestamp;
        gauge.convictionsByUser[user].push(convictionId);
        token.safeTransferFrom(user, address(this), amount);

        emit AddConviction(gaugeId, convictionId, user, amount);
    }

    // function removeConvictionByIds(
    //     uint256 gaugeId, uint256 count, bool fromRightSide
    // ) external {
    //     Gauge memory gauge = gauges[gaugeId];
    //     require(gauge.id != 0, "NONEXISTENT_GAUGE");
    //     uint256[] memory addressConvictions = gauge.convictionsByUser[msg.sender];

    //     if (fromRightSide) {
    //         addressConvictions = addressConvictions[]
    //     }
    // }

    /// @dev Generate a conviction score
    /// @param amount the amount of the deposit
    /// @param timestamp the time of the deposit
    function getScoreWeight(uint256 amount, uint256 timestamp)
        external
        pure
        returns (uint256 score)
    {
        // generate a score weight
        score = 0;

        // do some math...

        return score;
    }
}
