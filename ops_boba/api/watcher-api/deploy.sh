#!/bin/bash

if [[$STAGE == "all"]]; then
  echo 'You set STAGE to testnet. Deploying to Testnet...'
  cp env-testnet.yml env.yml &&
  serverless -c serverless-testnet.yml deploy &&
  rm -rf env.yml &&
  rm -rf .serverless &&
  echo 'You set STAGE to mainnet. Deploying to Mainnet...'
  cp env-mainnet.yml env.yml &&
  serverless -c serverless-mainnet.yml deploy &&
  rm -rf env.yml &&
  rm -rf .serverless
fi

if [[ $STAGE == "testnet" ]]; then
  echo 'You set STAGE to testnet. Deploying to Testnet...'
  cp env-testnet.yml env.yml &&
  serverless -c serverless-testnet.yml deploy &&
  rm -rf env.yml &&
  rm -rf .serverless
fi

if [[ $STAGE == "mainnet" ]]; then
  echo 'You set STAGE to mainnet. Deploying to Mainnet...'
  cp env-mainnet.yml env.yml &&
  serverless -c serverless-mainnet.yml deploy &&
  rm -rf env.yml &&
  rm -rf .serverless
fi
