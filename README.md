# Hardhat Vue Template

This project is intended as a template for kickstarting non-trivial Vue + Ethereum projects, leveraging TypeScript and integrating several tools that are found in common projects and required for building sustainable dApps.

It includes the following tools in an easy-to-navigate monorepo:

* [Hardhat](https://hardhat.org/)
* [Vue 2.x](https://vuejs.org/) (vue-cli)
  * [Vuex](https://vuex.vuejs.org/)
  * [Vue Router](https://router.vuejs.org/)
  * [Vue Toasted](https://shakee93.github.io/vue-toasted/)
  * [Bootstrap](https://getbootstrap.com/)
  * [Ethers.js](https://docs.ethers.io/v5/)
  * [Web3Modal](https://github.com/Web3Modal/web3modal)

Boilerplate unit testing is also included. On the Solidity side we use [Waffle](https://getwaffle.io/), and for the Vue frontend app, we're using [Jest](https://jestjs.io/) alongside some useful test helpers tha make mocking contract interaction less painful.

The project comes stock with a sample contract (the Greeter contract generated by Hardhat), and a simple web interface that handles connecting the user's wallet (MetaMask or other injected providers via Web3Modal) and reading and writing to that contract.

## Up and Running

First let's compile and deploy the simple Greet contract:

```shell
npm install
npx hardhat compile
npx hardhat node
npx hardhat run --network localhost scripts/deploy.ts
```

The above commands deploy the contract to Hardhat's own local testnet (hardhat node). You'll want to configure your MetaMask wallet to use the localhost (8545) network and import one of the accounts auto-generated by Hardhat (keys can be found by using `npx hardhat accounts`).

The deploy process also takes care of updating `addresses.json` and the Contract ABI that are required in the Vue app.

Once you've done this, you can start the web app by switching to the `frontend` directory where the app is nested:

```shell
cd frontend
npm install
npm run serve
```

Now you should be able to navigate to `http://localhost:8080`, connect your wallet, and interact with the application.

Ready to deploy to testnet? It's pretty straightforward to deploy the sample contract and web app using [Infura](https://infura.io/) and [Vercel](https://vercel.com/).

## Credits

This project was inspired in part by Gildor's [Hardhat Vue Starter](https://github.com/remote-gildor/hardhat-vue-starter) project but contains some key differences imported from my own projects and inspired by others.
