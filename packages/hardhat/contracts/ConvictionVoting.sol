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
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConvictionVoting is Ownable {
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
    }
}
