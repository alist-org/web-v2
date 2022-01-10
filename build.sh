#!/bin/bash

BUILD_LOCAL() {
  cd alist-web
  yarn
  yarn build
  mv dist/index.html dist/local.html
  mv dist/* ../dist
  cd ..
}

BUILD_CDN() {
  cd alist-web
  yarn
  webCommit=$(git log --pretty=format:"%h" -1)
  yarn build --base="https://cdn.jsdelivr.net/gh/alist-org/assets@v2/$webCommit"
  mv dist/index.html ../dist
  mkdir "../assets/$webCommit"
  mv dist/assets ../assets/$webCommit
  cd ..
}

COMMIT_ASSETS() {
  cd assets
  git add .
  git config --local user.email "i@nn.ci"
  git config --local user.name "Xhofe"
  git commit --allow-empty -m "upload $webCommit assets files" -a
  cd ..
}

MAKE_RELEASE() {
  mkdir release
  tar -czvf release/dist.tar.gz dist/*
  zip -r release/dist.zip dist/*
}

mkdir dist
BUILD_LOCAL
BUILD_CDN
COMMIT_ASSETS
MAKE_RELEASE