/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "../utils/EthEcho.json"

type EchoDetailsProps = {
  title: string
  value?: string
}

interface Echo {
  address: string;
  timestamp: Date;
  message: string;
}

const buttonStyle = "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const EchoDetails: React.FC<EchoDetailsProps> = ({ title, value = "N/A" }) => (
  <div className="py-3 px-4 block w-full border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700 dark:text-gray-100">
    <div>
      <p className="font-semibold">{title}</p>
      <p>{value}</p>
    </div>
  </div>
)

export default function Home() {
  /**  userのパブリックウォレットを保存するために使用する状態変数 */
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  console.log("currentAccount", currentAccount)

  /** ユーザーのメッセージを保存するために使用する状態変数 */
  const [messageValue, setMessageValue] = useState<string>("")
  const [latestEcho, setLatestEcho] = useState<Echo | null>(null)

  /** デプロイされたコントラクトのアドレスを保持する変数 */
  const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

  /** ABIの内容を参照する変数 */
  const contractABI = abi.abi

  const checkIfWalletIsConnected = async () => {
    // window.ethereumにアクセスできることを確認
    // ethereumプロパティの型情報がないためanyを使用
    const { ethereum } = window as any
    if (!ethereum) {
      console.log('make sure you have Metamask')
    } else {
      console.log('we have the ethereum object', ethereum)
    }

    // ユーザーのウォレットへのアクセスが許可されているかどうかを確認する
    const accounts = await ethereum.request({ method: "eth_accounts" })
    if (accounts.length !== 0) {
      /*
        eth_accountsは、Ethereumプロバイダーからアカウント情報を取得するためのメソッドです。
        使用すると、接続されたEthereumノードから利用可能なアカウントの一覧を取得できます。取得した後、
        currentAccountにユーザーのウォレットアカウント（例:0x...）の値が入ります。
      */
      const account = accounts[0]
      console.log("Found an authorized account:", account)
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      // check if the user have valid wallet address
      const { ethereum } = window as any
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      /*
        持っている場合はユーザーに対してウォレットへのアクセス許可を求める
        許可されれば、ユーザーの最初のウォレットアドレスをcurrentAccountに格納する
      */
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[]

      console.log("connected: ", accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * ABIを読み込み、コントラクトにEchoを書き込む
   */
  const writeEcho = async () => {
    try {
      const {ethereum} = window as any
      console.log({ ethereum })
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        /* ABIを参照する */
        const ethEchoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log({ ethEchoContract })
        let count = await ethEchoContract.getTotalEchoes()
        console.log("Retrieved total echo count...: ", Number(count))
        console.log("Signer: ", signer)

        /** コントラクトにEchoを書き込む */
        const echoTxn = await ethEchoContract.writeEcho(messageValue, {
          gasLimit: 300000,
        })
        console.log("Mining...: ", echoTxn.hash)

        await echoTxn.wait()
        console.log("Mined -- ", echoTxn.hash)

        count = await ethEchoContract.getTotalEchoes()
        console.log("Retrieved total echo count... ", Number(count))
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

 const getLatestEcho = async () => {
    const { ethereum } = window as any;
    try {
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const ethEchoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /* コントラクトからgetLatestEchoメソッドを呼び出す */
        const echo = await ethEchoContract.getLatestEcho();

        /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定する */
        const newLatestEcho: Echo = {
          address: echo.echoer,
          timestamp: new Date(Number(echo.timestamp) * 1000),
          message: echo.message,
        };

        /* React Stateにデータを格納する */
        setLatestEcho(newLatestEcho);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h1 className="text-2xl font-bold mt-10 leading-9 tracking-tight text-white-900">EthEcho</h1>
        <div className="bio mt-2 mb-8">
          イーサリアムウォレットを接続して、メッセージを作成しましょう
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg space-y-6">
        <div>
          {currentAccount ? (
            <div>
              {/* message input */}
              <textarea
                id="message"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="メッセージを入力してください"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
              />
              {/* コントラクトに書き込むボタン */}
              <button
                className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600`}
                onClick={writeEcho}
              >
                Add Echo
              </button>
              {/* コントラクトのメッセージを表示する */}
              <button
                className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 mt-6`}
                onClick={getLatestEcho}
              >
                Load Echoes
              </button>
            </div>
          ) : (
              <button
                className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600`}
                onClick={connectWallet}
              >
                ウォレットを接続
              </button>
          )}

          {/* 履歴を表示 */}
          {currentAccount &&
            latestEcho &&
            (
            <div className="py-3 px-4 block w-full border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700 dark:text-gray-100">
              <div>
                <EchoDetails
                  title="Address"
                  value={latestEcho.address}
                />
                <EchoDetails
                  title="Time⏰"
                  value={latestEcho.timestamp.toString()}
                />
                <EchoDetails
                  title="Message"
                  value={latestEcho.message}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
