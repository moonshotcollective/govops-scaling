//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CGTC is ERC20 {
    constructor(address admin) ERC20("Gitcoin Voting Token", "CGTC") {
        _mint(admin, 100000 ether);
    }

    function faucetMint() public {
        _mint(msg.sender, 100000000 ether);
    }
}
