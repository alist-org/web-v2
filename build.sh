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
  yarn build --base="https://cdn.jsdelivr.net/gh/alist-org/assets@$webCommit"
  mv dist/index.html ../dist/jsdelivr.html
  cd ../assets
  rm -rf assets
  mv ../alist-web/dist/assets .
  git add .
  git config --local user.email "i@nn.ci"
  git config --local user.name "Xhofe"
  git commit --allow-empty -m "upload $webCommit assets files" -a
  git tag -a $webCommit -m "upload $webCommit assets files"
  cd ..
}

BUILD_UNPKG_ZHIMG() {
  cd alist-web
  version=$(git describe --abbrev=0 --tags | awk -F- '{print $1}')
  sed -i -e "s/0.0.0/$version/g" package.json
  yarn build --base="https://unpkg.zhimg.com/alist-web@$version/dist"
  cp dist/index.html ../dist/zhimg.html
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
BUILD_UNPKG_ZHIMG
MAKE_RELEASE