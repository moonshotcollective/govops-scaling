//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GTC is ERC20 {
    constructor(address admin) ERC20("Gitcoin", "GTC") {
        _mint(admin, 100000 ether);
        _mint(0x3052dd5F8196f65341d0bCd3540c9Fc6660EbED2, 1000000 ether);
    }

    function faucetMint() public {
        _mint(msg.sender, 100000000 ether);
       
    }
}
