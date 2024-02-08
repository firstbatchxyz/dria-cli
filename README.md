<p align="center">
  <img src="https://raw.githubusercontent.com/firstbatchxyz/dria-js-client/master/logo.svg" alt="logo" width="142">
</p>

<p align="center">
  <h1 align="center">
    Dria CLI
  </h1>
  <p align="center">
    <i>Dria CLI is a command-line tool that can be used to interact with Dria.</i>
  </p>
</p>

<p align="center">
    <a href="https://opensource.org/licenses/MIT" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-7CB9E8.svg">
    </a>
    <a href="https://www.npmjs.com/package/dria-cli" target="_blank">
        <img alt="NPM" src="https://img.shields.io/npm/v/dria-cli?logo=npm&color=CB3837">
    </a>
</p>

## Installation

Dria CLI requires NodeJS & Docker to be installed on your machine, and is available on NPM. It can be installed to your system with:

```sh
npm i -g dria
```

## Usage

You can see available commands with `dria help`:

```sh
dria <command>

Commands:
  dria pull  [contract]         Pull a Dria knowledge to your local machine.
  dria serve [contract]         Serve a local Dria knowledge.
  dria clear [contract]         Clear local knowledge data.
  dria set-contract <contract>  Set default contract.
  dria set-wallet <wallet>      Set default wallet.
  dria config                   Show default configurations.
  dria list                     List interacted contracts.
  dria stop                     Stop serving Dria.

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -v, --verbose  Show extra information               [boolean] [default: false]
```

### Pull Knowledge

A Dria knowledge is stored on blockchain, and we can pull that knowledge to our local machine with the `pull` command:

```sh
dria pull <contract>
dria pull # use configured contract

# provide a wallet
dria pull -w <wallet-path>
```

### Serve Knowledge

After [pulling](#pull-knowledge) a knowledge, you can serve a HNSW index over it with:

```sh
dria serve <contract>
dria serve # use configured contract
```

### Stop Serving

The [served](#serve-knowledge) HNSW index runs in the background, and you can stop it anytime with:

```sh
dria stop
```

### Configurations

You can set the default wallet & contract with `set-contract` and `set-wallet` commands respectively. When a contract is set by default, `[contract]` can be omitted such that the CLI will use the default one. To see the defaults:

```sh
# view configured wallet & contract
dria config

# change contract
dria set-contract <contract>

# change wallet
dria set-wallet ./path/to/wallet.json
```

### List Pulled Knowledge

You can print out the list of contracts [pulled](#pull-knowledge) so far, along with their last modification date, with the command:

```sh
dria list
```

> [!NOTE]
>
> If a contract that you have pulled has new data inserted to it after you have pulled it, you will have to pull again to get the latest data.

### Remove Knowledge

To clear up some space by deleting a knowledge, use:

```sh
dria clear <contract>
dria clear # use configured contract
```

## Setup

To setup the repository locally, first you must clone it:

```sh
git clone https://github.com/firstbatchxyz/dria-cli.git
cd dria-cli
```

Then, install packages with:

```sh
yarn install
```

You can run the CLI as if you are calling `npx dria` with the following command:

```sh
yarn cli
```

## Styling

You can lint & check formatting with:

```sh
yarn lint
yarn format
```
