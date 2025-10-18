# Glass Calculator

A sleek, glassmorphism-inspired calculator web application built with vanilla HTML, CSS, and JavaScript.

## Features

- Responsive layout with an animated glass visual style
- Support for addition, subtraction, multiplication, and division
- Percentage conversion, decimal input, and backspace controls
- Smart input handling that prevents invalid sequences and highlights errors

## Running on the Web

1. Clone or download this repository.
2. Open `www/index.html` in your preferred browser.
3. Start calculating!

## Building an Android APK

This project now bundles a Capacitor-powered Android container so the same web experience can run as a native Android application.

### Prerequisites

- Node.js 16+
- Java 11+ (recommended)
- Android SDK / Android Studio (for Gradle builds and device emulators)

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```
2. Sync the web assets into the native Android project:
   ```bash
   npx cap sync android
   ```
3. Build the debug APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

The generated APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`. You can install it on a device with:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Alternatively, open the project in Android Studio with:
```bash
npx cap open android
```
and build or run it from there.

Remember to re-run `npx cap sync android` any time you change the files inside `www/` so the latest web assets are copied into the native project before building.
