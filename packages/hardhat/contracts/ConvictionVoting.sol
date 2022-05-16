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
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract ConvictionVoting is Ownable {
    using SafeERC20 for IERC20;

    struct Gauge {
        uint256 id;
        mapping(uint256 => Conviction) conviction;
        uint256 currentConvictionId;
    }

    struct Conviction {
        address userAddress;
        uint256 amount;
        uint256 timestamp;
    }

    uint256 currentGaugeId;

    /// @dev Mapping of all gauges structs
    mapping(uint256 => Gauge) gauges;

    /// @dev Mapping of conviction scores for a user
    mapping(address => uint256) scores;

    IERC20 token;

    event NewGauge(uint256 indexed id);
    event AddConviction(
        uint256 indexed gaugeId,
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
        Conviction storage conviction = gauge.conviction[
            gauge.currentConvictionId++
        ]; // convictionId starts from 0...
        conviction.userAddress = user;
        conviction.amount = amount;
        conviction.timestamp = block.timestamp;
        token.safeTransferFrom(user, address(this), amount);

        emit AddConviction(gaugeId, user, amount);
    }

    /// @dev return Gauge information
    /// @param gaugeId the id of the gauge to return values for
    function getGaugeById(
        uint256 gaugeId
    ) external view returns(uint256, Conviction memory, uint256) {
      Gauge storage gauge = gauges[gaugeId];
      // uint256 conviction = gauge.conviction; // ? Total Score ?

      // return (0, conviction, 0);
    }

    /// @dev Generate a conviction score
    /// @param amount the amount of the deposit
    /// @param timestamp the time of the deposit
    function getScoreWeight(
        uint256 amount,
        uint256 timestamp
    ) external pure returns(uint256 score) {
        // generate a score weight
        score =  0;

        // do some math...

        return score;
    }



}
