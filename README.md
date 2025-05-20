# libsocial

## Prepare

1. Install dependencies

   ```bash
   bun install
   ```

2. Add API URL for mobile package in `.env` file

   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

3. For API package follow `.env.example` instructions

4. (Optional) Add this script to `.git/hooks/post-commit` for app-versioning

   ```bash
   #!/bin/bash

   version=$(git rev-parse --short HEAD)

   sed -i '' '/^EXPO_PUBLIC_VERSION/d' packages/mobile/.env
   echo "EXPO_PUBLIC_VERSION=$version" >> packages/mobile/.env
   ```

## iOS Setup

Go to `packages/mobile` folder and run `bun run ios  -- -d` to install all dependencies and launch app.

## Android Setup

1. Go to `packages/mobile`

2. Create native folder

   ```bash
   bunx expo prebuild --platform android  --clean
   ```

3. Start the app

   ```bash
   bun run android
   ```

Or open **android** folder in Android Studio and start building from there

## Start

Run `bun dev` in root monorepo folder
