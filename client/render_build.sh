#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Clean build directory..."
rm -rf build

echo "Installing Flutter..."
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

echo "Flutter version:"
flutter --version

echo "Enabling web..."
flutter config --enable-web

echo "Getting packages..."
flutter pub get

echo "Building web..."
flutter build web --release
