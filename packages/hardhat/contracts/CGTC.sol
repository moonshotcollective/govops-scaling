//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CGTC is ERC20, Ownable {

    event TokensClaimed(address indexed claimant, uint256 indexed amountClaimed);

    constructor(address admin) ERC20("Gitcoin Voting Token", "CGTC") {
        _mint(admin, 100000 ether);
        transferOwnership(admin);
    }

    function faucetMint() public {
        _mint(msg.sender, 100000000 ether);
    }

    function claimTokens(uint256 amount) public {
        // todo: make sure they can mint this many...
        _mint(msg.sender, amount);

        emit TokensClaimed(msg.sender, amount);
    }
}
