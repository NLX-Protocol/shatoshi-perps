// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

interface ISLP {
    function mint(address _account, uint256 _amount) external;
    function burn(address _account, uint256 _amount) external;
}
