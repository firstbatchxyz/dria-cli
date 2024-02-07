# Dria CLI

Dria CLI is a command-line tool that can be used to interact with Dria.

TODO: Warp cache and unbundled values should be stored on separate spaces

TODO: try with contract WbcY2a-KfDpk7fsgumUtLC2bu4NQcVzNlXWi13fPMlU

## Installation

Dria CLI requires NodeJS, and is available on NPM. It can be installed to your system with:

```sh
npm i -g dria
```

## Usage

Dria CLI has the following commands:

```sh
# print information about Docker & configured contract and such?
dria info

# load & unbundle values to your local machine
dria pull [contract-id]

# serve a knowledge
dria serve [contract-id]

# stop serving
dria stop

# clear downloaded data
dria clear [contract-id]
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

You can run the CLI as if you calling `npx dria` with the following command:

```sh
yarn cli
```

## Styling

You can lint & check formatting with:

```sh
yarn lint
yarn format
```
