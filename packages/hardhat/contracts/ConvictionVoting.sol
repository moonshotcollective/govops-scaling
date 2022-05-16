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
    mapping(uint256 => Gauge) gauges;

    IERC20 token;

    event NewGauge(uint256 indexed id);
    event AddConviction(
        uint256 indexed gaugeId,
        address indexed user,
        uint256 indexed amount
    );

    constructor(IERC20 newToken, address owner) {
        token = newToken;
        _transferOwnership(owner);
    }

    function addGauge() external onlyOwner {
        uint256 current = ++currentGaugeId;
        Gauge storage gauge = gauges[current]; // gauges start from 1...
        gauge.id = current;

        emit NewGauge(current);
    }

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
}
