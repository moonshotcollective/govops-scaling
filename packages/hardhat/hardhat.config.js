/* eslint-disable no-console,no-underscore-dangle */
require("dotenv").config();
const fs = require("fs");

require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");

require("hardhat-deploy");
require("hardhat-gas-reporter");
require("hardhat-abi-exporter");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");
const EthUtil = require("ethereumjs-util");
const qrcode = require("qrcode-terminal");

const { isAddress, getAddress, formatUnits } = require("ethers/lib/utils");

const { DEBUG } = process.env;

/*
      📡 This is where you configure your deploy configuration for 🏗 scaffold-eth

      check out `packages/scripts/deploy.js` to customize your deployment

      out of the box it will auto deploy anything in the `contracts` folder and named *.sol
      plus it will use *.args for constructor args
*/

//
// Select the network you want to deploy to here:
//
const defaultNetwork = "localhost";

const mainnetGwei = 39;

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    return "";
  }
}

module.exports = {
  defaultNetwork,

  /**
   * gas reporter configuration that let's you know
   * an estimate of gas for contract deployments and function calls
   * More here: https://hardhat.org/plugins/hardhat-gas-reporter.html
   */
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP || null,
  },

  // if you want to deploy to a testnet, mainnet, or xdai, you will need to configure:
  // 1. An Infura key (or similar)
  // 2. A private key for the deployer
  // DON'T PUSH THESE HERE!!!
  // An `example.env` has been provided in the Hardhat root. Copy it and rename it `.env`
  // Follow the directions, and uncomment the network you wish to deploy to.

  networks: {
    localhost: {
      url: "http://localhost:8545",
      /*      
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      
      */
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/mainnet", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: mainnetGwei * 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      //      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/goerli", // <---- YOUR MORALIS ID! (not limited to infura)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    polygon: {
      url: "https://polygon-rpc.com",
      // url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXx/polygon/mainnet", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: 3200000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      // url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXX/polygon/mumbai", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: 3200000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    optimism: {
      url: "https://mainnet.optimism.io",
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: "mainnet",
      },
    },
    kovanOptimism: {
      url: "https://kovan.optimism.io",
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: "kovan",
      },
    },
    localOptimism: {
      url: "http://localhost:8545",
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: "localOptimismL1",
      },
    },
    localOptimismL1: {
      url: "http://localhost:9545",
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l2: "localOptimism",
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  etherscan: {
    apiKey: {
      mainnet: "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW",
      // add other network's API key here
    },
  },
  abiExporter: {
    path: "../react-app/src/contracts/ABI",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: false,
  },
};

// eslint-disable-next-line no-undef
task("generate", "Create a mnemonic for builder deploys", async () => {
  const newMnemonic = bip39.generateMnemonic();
  if (DEBUG) console.log("mnemonic", newMnemonic);
  const seed = await bip39.mnemonicToSeed(newMnemonic);
  if (DEBUG) console.log("seed", seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdpath = "m/44'/60'/0'/0/";
  const accountIndex = 0;
  const fullPath = walletHdpath + accountIndex;
  if (DEBUG) console.log("fullPath", fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet._privKey.toString("hex")}`;
  if (DEBUG) console.log("privateKey", privateKey);
  const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString(
    "hex"
  )}`;
  console.log(
    `🔐 Account Generated as ${address} and set as mnemonic in packages/hardhat`
  );
  console.log(
    "💬 Use 'yarn run account' to get more information about the deployment account."
  );

  fs.writeFileSync(`./${address}.txt`, mnemonic.toString());
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
});

// eslint-disable-next-line no-undef
task(
  "account",
  "Get balance informations for the deployment account.",
  async () => {
    const newMnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    if (DEBUG) console.log("mnemonic", newMnemonic);
    const seed = await bip39.mnemonicToSeed(newMnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const walletHdpath = "m/44'/60'/0'/0/";
    const accountIndex = 0;
    const fullPath = walletHdpath + accountIndex;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = `0x${wallet._privKey.toString("hex")}`;
    if (DEBUG) console.log("privateKey", privateKey);
    const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString(
      "hex"
    )}`;

    qrcode.generate(address);
    console.log(`‍📬 Deployer Account is ${address}`);
    for (const n in config.networks) {
      // console.log(config.networks[n],n)
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          config.networks[n].url
        );
        const balance = await provider.getBalance(address);
        console.log(` -- ${n} --  -- -- 📡 `);
        console.log(`   balance: ${ethers.utils.formatEther(balance)}`);
        console.log(`   nonce: ${await provider.getTransactionCount(address)}`);
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  }
);

async function addr(ethers, _addr) {
  if (isAddress(_addr)) {
    return getAddress(_addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[_addr] !== undefined) {
    return accounts[_addr];
  }
  throw Error(`Could not normalize address: ${_addr}`);
}

// eslint-disable-next-line no-undef
task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account) => console.log(account));
});

// eslint-disable-next-line no-undef
task("blockNumber", "Prints the block number", async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

// eslint-disable-next-line no-undef
task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await addr(ethers, taskArgs.account)
    );
    console.log(formatUnits(balance, "ether"), "ETH");
  });
