Web3_firstProject
My first Web3 project — a simple dApp, learning essential components and workflow for Web3.

Overview
This project helps me learn how to build a decentralized application (dApp) with all fundamental building blocks:

Smart contract (Solidity)

Front-end application (JavaScript/TypeScript + CSS/HTML)

Connection between front-end and blockchain

Folder Structure
text
Web3_firstProject/
├── client/           # Front-end source code (JavaScript/TypeScript, CSS, HTML)
├── smart_contract/   # Smart contracts (Solidity)
├── .gitattributes    # Git config file
Technologies Used
Solidity: smart contract development

JavaScript/TypeScript, HTML, CSS: client interface

Web3 library: to connect UI with blockchain (ethers.js)

Wallet (MetaMask): for user authentication & signing transactions

Learning Goals
Understand dApp development flow

Practice building smart contracts and connecting front-end

See how components interact: smart contract <–> wallet <–> front end

Getting Started
Install dependencies

Go into client and run:

bash
npm install
Go into smart_contract for contract related scripts

Deploy smart contract

Write/deploy smart contract using framework (Hardhat)

Run front-end

Start local server from client folder

Connect to MetaMask or chosen wallet

How It Works
Front-end lets users interact (send transaction, view data)

Front-end connects via Web3 provider to deployed smart contract

All core dApp flows are demonstrated

Author
tuananh2903
