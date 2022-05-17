//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GTC is ERC20 {
    constructor(address admin) ERC20("Gitcoin", "GTC") {
        _mint(admin, 100000 ether);
    }

    function faucetMint() public {
        _mint(msg.sender, 10000 ether);
    }
}
