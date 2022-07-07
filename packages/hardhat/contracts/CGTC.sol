//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CGTC is ERC20, Ownable, ERC20Burnable {

    event TokensClaimed(address indexed claimant, uint256 indexed amountClaimed);
    event TokensBurned(address indexed claimant, uint256 indexed amountBurned);

    error NotOwner();
    error ZeroBalance();

    address public _gtcAddress;

    constructor(address admin, address gtcAddress) ERC20("Gitcoin Voting Token", "CGTC") {
        _gtcAddress = gtcAddress;
        _mint(admin, 100000 ether);
        transferOwnership(admin);
    }

    /// @dev this is for test only and will be removed for prod
    function faucetMint() public {
        _mint(msg.sender, 100000000 ether);
    }

    function getClaimAmount() public returns(uint256 claimAmount) {
        // todo: get the amount to mint

        return 10000 ether;
    }

    /// @notice Claims CGTC tokens based on GTC balances
    ///         for the callers address.
    function claimTokensForCaller() public {
        // get the amount to mint
        uint256 amount = getClaimAmount();
        // todo: make sure they can mint this many...
        _mint(msg.sender, amount);

        emit TokensClaimed(msg.sender, amount);
    }

    /// @notice Claims CGTC tokens based on GTC balances
    ///         for a specific address.
    function claimTokensForAddress(address user) public {
        // get the amount to mint
        uint256 amount = getClaimAmount();
        // todo: make sure they can mint this many...
        _mint(user, amount);

        emit TokensClaimed(user, amount);
    }

    /// @notice Burn from a specific address
    function burnFromAddress(address user) public {
        uint256 amount = IERC20(address(this)).balanceOf(msg.sender);
        if(amount > 0){
            burnFrom(user, amount);

            emit TokensBurned(user, amount);
        }

        revert ZeroBalance();
    }

    /// @notice Burn from callers address
    function burnFromCaller() public {
        uint256 amount = IERC20(address(this)).balanceOf(msg.sender);
        if(amount > 0){
            burn(amount);

            emit TokensBurned(msg.sender, amount);
        }

        revert ZeroBalance();
    }
}
