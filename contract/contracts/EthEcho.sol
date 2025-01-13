// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract EthEcho {

    uint256 private _totalEchoes;

    constructor() {
        console.log("Here is my first smart contract!");
    }

    // ユーザーが「Echo」を送信するたびに呼ばれ、_totalEchoesを増やす
    function writeEcho() public {
        _totalEchoes += 1;
        console.log("%s has echoed!", msg.sender);
    }

    // 現在の「Echo」の総数を取得するための関数
    function getTotalEchoes() public view returns (uint256) {
        console.log("We have %d total echoes!", _totalEchoes);
        return _totalEchoes;
    }
}
