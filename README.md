<p align="center">
  <img src="https://raw.githubusercontent.com/firstbatchxyz/dria-js-client/master/logo.svg" alt="logo" width="142">
</p>

<p align="center">
  <h1 align="center">
    Dria CLI
  </h1>
  <p align="center">
    <i>Dria CLI is a command-line tool that can be used to interact with Dria locally.</i>
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

Dria CLI requires NodeJS (>= 18.0.0) & Docker to be installed on your machine, and is available on NPM. It can be installed to your system with:

```sh
npm i -g dria-cli
```

## Usage

You can see available commands with `dria help`, which outputs:

```sh
dria <command>

Commands:
  dria pull [contract]          Pull a knowledge to your local machine.
  dria serve [contract]         Serve a local knowledge.
  dria clear [contract]         Clear local knowledge.
  dria fetch <txid>             Fetch an existing index on Arweave.
  dria extract <zip-path>       Extract a compressed knowledge.
  dria set-contract <contract>  Set default contract.
  dria config                   Show default configurations.
  dria list                     List all local knowledge.
  dria stop                     Stop serving knowledge.

Options:
      --help     Show help                                           [boolean]
      --version  Show version number                                 [boolean]
  -v, --verbose  Show extra information             [boolean] [default: false]
```

> [!WARNING]
>
> If you are using Docker with `sudo` only, you must use the Dria CLI with `sudo` as well, since it needs access
> to Docker in the background. Otherwise, the CLI will not be able to detect your Docker engine.
> See more [here](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).

### Pull Knowledge

A Dria knowledge is stored on blockchain, and we can pull that knowledge to our local machine with the `pull` command:

```sh
dria pull <contract>
dria pull # use configured contract
```

### Serve Knowledge

After [pulling](#pull-knowledge) a knowledge, you can serve the HNSW index over it with:

```sh
dria serve <contract>
dria serve # use configured contract
```

### Stop Serving

The [served](#serve-knowledge) HNSW index runs in the background, and you can stop it anytime with:

```sh
dria stop
```

### Fetch Knowledge

You can download an existing HNSW index that lives in RocksDB and is zipped & uploaded to Arweave, which is much a faster option than `dria pull` command for an existing index.

```sh
dria fetch <txid>
```

Note that the argument here is not the knowledge ID (i.e. the corresponding Arweave contract txID); instead, it is the transaction ID of the bundling transaction where the RocksDB folder was zipped & uploaded to Arweave.

### Extract Knowledge

The previously mentioned [fetch](#fetch-knowledge) command downloads a zip file from Arweave & extracts it. However, in some cases you might have the knowledge on another platform that is easier to access compared to downloading from Arweave, especially if internet connection is an issue. For such cases, we have the extract command which simply unzips the compressed knowledge under Dria's data directory.

```sh
dria extract <zip-path>
```

### Configurations

You can set the default contract with `set-contract` command. When a contract is set by default, `[contract]` can be omitted such that the CLI will use the default one. To see the defaults:

```sh
# view configurations
dria config

# change contract
dria set-contract <contract>
```

### List Knowledge

You can print out the list of contracts [pulled](#pull-knowledge) or [fetched](#fetch-knowledge) so far, along with their last modification date, with the command:

```sh
dria list
```

> [!NOTE]
>
> If a knowledge has new data inserted to it, you will have to pull it again to catch up.

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
yarn dria
```

## Styling

You can lint & check formatting with:

```sh
yarn lint
yarn format
```

## License

See [LICENSE](./LICENSE).
