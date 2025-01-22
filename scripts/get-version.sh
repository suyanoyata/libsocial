#!/bin/bash

version=$(git rev-parse --short HEAD)

sed -i '' '/^EXPO_PUBLIC_VERSION/d' .env
echo "EXPO_PUBLIC_VERSION=$version" >> .env

echo "replaced with $version version"