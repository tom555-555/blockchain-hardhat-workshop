# blockchain-hardhat-workshop
スマートコントラクトとフロントエンドの連携方法について学ぶためのリポジトリです。

## 環境構築

### 0. マシン環境を揃える

```jsx
homebrewをインストール

git をインストール

nvmをインストール

node v22をインストール
```

### 1. ウォレットの作成

[MetaMaskのダウンロード（拡張機能）](https://metamask.io/download/)

### 2. 立ち上げ

今回使うフォルダ(ディレクトリ)を作成

```jsx
cd <任意のディレクトリ> // フォルダの移動
mkdir <任意のディレクトリ> // ディレクトリの作成
cd <上記で作ったディレクトリ>
```

[リポジトリ](https://github.com/tom555-555/blockchain-hardhat-workshop)からソースコードを取得

```jsx
git clone https://github.com/tom555-555/blockchain-hardhat-workshop.git
```

スマートコントラクト

```jsx
cd blockchain-hardhat-workshop // 上記でcloneしたディレクトリに移動
npm i // パッケージのインストール
npm run run:script // スマートコントラクトの動作検証
npm run start // hardhatネットワークの立ち上げ(ローカルイーサリアムネットワーク)
npm run deploy // スマートコントラクトをhardhat networkにデプロイする
```

フロントエンド

```jsx
cd ../client
npm i // パッケージのインストール
npm run dev // フロントエンドサーバー起動
```



```
