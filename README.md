# libsocial

## Prepare

1. Install dependencies

   ```bash
   npm install
   ```

2. Add this script to `.git/hooks/post-commit` for app-versioning

   ```bash
   #!/bin/bash

   version=$(git rev-parse --short HEAD)

   sed -i '' '/^EXPO_PUBLIC_VERSION/d' .env
   echo "EXPO_PUBLIC_VERSION=$version" >> .env
   ```

## iOS Setup

Run `npm run ios  -- -d` to install all dependencies and launch app.

## Android Setup

1. Create native folder

   ```bash
   npx expo prebuild --platform android  --clean
   ```

2. Start the app

   ```bash
   npm run android
   ```

Or open **android** folder in Android Studio and start building from there
