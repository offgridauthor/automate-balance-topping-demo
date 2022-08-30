# Minimum Balance Agent

## Description

This agent detects when a specified account balance is below 0.1 LINK

## Supported Chains

- Ethereum

## Alerts

- FORTA-6
  - Fired when a specified account balance is below 0.1 LINK
  - Severity is always set to "info"
  - Type is always set to "suspicious"
  - Metadata "balance" field contains amount of wei in account
