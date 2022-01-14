/*
Copyright 2019-present OmiseGO Pte Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

require('dotenv').config()

let NETWORKS

if (process.env.REACT_APP_CHAIN === 'testnet') {
  NETWORKS = {
    testnet: {
      OMGX_WATCHER_URL: null,
      MM_Label:         `Testnet`,
      addressManager:   `0x8c497Bc25545AEe5D5753Bde842A1E9aCb1EeF95`,
      L1: {
        name: "Testnet",
        chainId: 97,
        chainIdHex: '0x61',
        rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545`,
        blockExplorer: `https://api-testnet.bscscan.com/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API}`,
        transaction: `https://testnet.bscscan.com/tx/`
      },
      L2: {
        name: "HABTOR Testnet L2",
        chainId: 31899,
        chainIdHex: '0x7C9B',
        rpcUrl: `https://testnet.habtor.com`,
        blockExplorer: `https://testnet.habtorscan.com/`,
        transaction: `https://testnet.habtorscan.com/tx/`
      }
    }
  }
} else if (process.env.REACT_APP_CHAIN === 'mainnet') {
  NETWORKS = {
    mainnet: {
      OMGX_WATCHER_URL: null,
      MM_Label:         `Mainnet`,
      addressManager:   `0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089`,
      L1: {
        name: "Mainnet",
        chainId: 56,
        chainIdHex: '0x38',
        rpcUrl: `https://bsc-dataseed.binance.org`,
        blockExplorer: `https://api.bscscan.com/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API}`,
        transaction: ` https://bscscan.com/tx/`,
      },
      L2: {
        name: "HABTOR L2",
        chainId: 899,
        chainIdHex: '0x383',
        rpcUrl: `https://mainnet.habtor.com`,
        blockExplorer: `https://habtorscan.com/`,
        transaction: `https://habtorscan.com/tx/`,
      }
    }
  }
} else if (process.env.REACT_APP_CHAIN === 'local') {
  NETWORKS = {
    local: {
      OMGX_WATCHER_URL: null, //Does not exist on local
      MM_Label:         `Local`,
      addressManager:   `0x5FbDB2315678afecb367f032d93F642f64180aa3`,
      L1: {
        name: "Local L1",
        chainId: 31337,
        chainIdHex: '0x7A69',
        rpcUrl: `http://${window.location.hostname}:9545`,
        blockExplorer: null, //does not exist on local
      },
      L2: {
        name: "Local L2",
        chainId: 31338,
        chainIdHex: '0x7A6A',
        rpcUrl: `http://${window.location.hostname}:8545`,
        blockExplorer: null, //does not exist on local
      },
    }
  }
}

const BaseServices = {
  WALLET_SERVICE:   `https://api-service.habtor.com/`,
  //relevant to local?
  SERVICE_OPTIMISM_API_URL: `https://zlba6djrv6.execute-api.us-west-1.amazonaws.com/prod/`,
  //relevant to local?
  WEBSOCKET_API_URL: `wss://d1cj5xnal2.execute-api.us-west-1.amazonaws.com/prod`,
  //Coing gecko url
  COIN_GECKO_URL: `https://api.coingecko.com/api/v3/`,
  //ETH gas station
  ETH_GAS_STATION_URL: `https://ethgasstation.info/`,
}

export function getAllNetworks () {
  return NETWORKS
}

export function getBaseServices () {
  return BaseServices
}
