#!/bin/bash

BUILD_LOCAL() {
  cd alist-web
  yarn
  yarn build
  mv dist/index.html dist/local.html
  mv dist/* ../dist
  cd ..
}

BUILD_JSDELIVR() {
  cd alist-web
  yarn
  webCommit=$(git log --pretty=format:"%h" -1)
  gitTag=$(git describe --long --tags --always)
  yarn build --base="https://cdn.jsdelivr.net/gh/alist-org/assets@$gitTag"
  mv dist/index.html ../dist/jsdelivr.html
  cd ../assets
  rm -rf assets
  mv ../alist-web/dist/assets .
  git add .
  git config --local user.email "i@nn.ci"
  git config --local user.name "Xhofe"
  git commit --allow-empty -m "upload $gitTag assets files" -a
  git tag -a $gitTag -m "upload $gitTag assets files"
  cd ..
}

BUILD_UNPKG_ZHIMG() {
  cd alist-web
  version=$(git describe --abbrev=0 --tags)
  sed -i -e "s/0.0.0/$version/g" package.json
  yarn build --base="https://unpkg.zhimg.com/alist-web@$version/dist"
  cp dist/index.html ../dist/zhimg.html
  cd ..
}

BUILD_UNPKG() {
  cd alist-web
  version=$(git describe --abbrev=0 --tags)
  sed -i -e "s/0.0.0/$version/g" package.json
  yarn build --base="https://unpkg.com/alist-web@$version/dist"
  cp dist/index.html ../dist/unpkg.html
  cd ..
}

MAKE_RELEASE() {
  mkdir release
  tar -czvf release/dist.tar.gz dist/*
  zip -r release/dist.zip dist/*
}

mkdir dist
BUILD_LOCAL
BUILD_JSDELIVR
# BUILD_UNPKG_ZHIMG
BUILD_UNPKG
MAKE_RELEASE