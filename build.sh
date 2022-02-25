#!/bin/bash
cd alist-web
version=$(git describe --abbrev=0 --tags)
sed -i -e "s/0.0.0/$version/g" package.json
yarn
yarn build
cp -r dist ../

# github
cd ../assets
rm -rf dist
cp -r ../dist .
git add .
git config --local user.email "i@nn.ci"
git config --local user.name "Xhofe"
git commit --allow-empty -m "upload $version assets files" -a
git tag -a $version -m "upload $version assets files"
cd ..

mkdir release
tar -czvf release/dist.tar.gz dist/*
zip -r release/dist.zip dist/*