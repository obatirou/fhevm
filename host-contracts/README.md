## Introduction

This node package contains the core Solidity host contracts needed to deploy an FHEVM instance on a host EVM blockchain.

## Prerequisites

- Node.js 18 or newer (ships with `npm`)
- The Foundry toolchain with built-in `soldeer` package manager is available

## Installation

1. Install the JavaScript dependencies:
   ```bash
   npm install
   ```
   The `postinstall` hook automatically runs `forge soldeer install` to sync the Foundry dependencies defined in `foundry.toml` and locked in `soldeer.lock`.
2. If your Foundry installation predates `soldeer`, update it with `foundryup` (or install from scratch via the [Foundry docs](https://book.getfoundry.sh/getting-started/installation)) and rerun:
   ```bash
   forge soldeer install
   ```
3. Copy `.env.example` to `.env` if you need to override environment defaults used by the Make targets.

## Running tests

- Run the Hardhat suite:
  ```bash
  make test
  ```
- Execute Foundry tests while ensuring soldeer-managed dependencies are up to date:
  ```bash
  make forge-test
  ```

## Additional commands

- Compile contracts and generate deployment artifacts:
  ```bash
  make compile
  ```
- Format the codebase with Prettier:
  ```bash
  make prettier
  ```
- Format sources, update generated artifacts, and run selector checks:
  ```bash
  make conformance
  ```
- Remove build artifacts and cache:
  ```bash
  make clean
  ```
