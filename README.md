# Build & Run Guide for Icarus Website (React + Vite + TSX)

This document explains how to set up the environment and build the project using **Node.js v24** with `nvm` and `pnpm` on Linux/macOS.

---

## 1. Install NVM (Node Version Manager)

NVM lets you install and switch between Node versions easily.

```bash
# Download and install nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm into your shell session
source ~/.bashrc   # or source ~/.zshrc if using zsh

#Verify installation:
nvm --version

#Install node v24 and set it as default
nvm install 24 && nvm use 24 && nvm alias default 24

```

## Installing npm and pnpm

```bash
#For Mac and Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

#For Windows, install npm and then pnpm using
npm install -g pnpm

```

## Clean Environment

```bash
rm -rf node_modules pnpm-lock.yaml

```

## Install deps and run development server
```bash
pnpm install 

pnpm dev
```