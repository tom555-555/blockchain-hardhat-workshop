// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract EthEcho {

    uint256 private _totalEchoes;
    event NewEcho(address indexed from, uint256 timestamp, string message);

    struct Echo {
        address echoer; // Echo を送ったユーザーのアドレス
        string message; // ユーザーが送ったメッセージ
        uint256 timestamp; // ユーザーがEchoを送った瞬間のタイムスタンプ
    }

    /** ユーザーが送ってきた最新のEchoを保持する */
    Echo private _latestEcho;

    constructor() {
        console.log("Here is my first smart contract!");
    }

    // ユーザーが「Echo」を送信するたびに呼ばれ、_totalEchoesを増やす
    function writeEcho(string memory _message) public {
        _totalEchoes += 1;
        console.log("%s has echoed!", msg.sender, _message);

        /** Echoとメッセージを格納する */
        _latestEcho = Echo(msg.sender, _message, block.timestamp);

        /**
            TOLEARN: what is emit????
        */
        emit NewEcho(msg.sender, block.timestamp, _message);
    }

    // 現在の「Echo」の総数を取得するための関数
    function getTotalEchoes() public view returns (uint256) {
        console.log("We have %d total echoes!", _totalEchoes);
        return _totalEchoes;
    }

    /**
        TOLEARN: what is memory???
     */
    function getLatestEcho() public view returns (Echo memory) {
        return _latestEcho;
    }
}
