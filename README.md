# Whack A Mole Game (Expo React Native)

This is a Whack A Mole game built with [Expo](https://expo.dev) and React Native.

## Features

- Selectable mole speed (ms) before starting the game
- Selectable game duration (15, 30, 45, or 60 seconds)
- Choose from different mole types (emojis)
- 3x3 grid: tap the mole to score points
- Timer countdown and game over screen
- Visual feedback: background flashes green for correct, red for wrong, with smooth transitions
- Responsive and mobile-friendly UI

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the app**
   ```bash
   npx expo start
   ```
3. **Open the app**
   - Use an Android/iOS emulator, or scan the QR code with Expo Go on your device.

## How to Play

1. On the home screen, tap **O'yinga o'tish** to start.
2. In the setup screen:
   - Select the mole speed (in seconds)
   - Select the game duration (in seconds)
   - Choose your favorite mole emoji
   - Tap **Boshlash** to begin
3. During the game:
   - Tap the mole as it appears in the grid to score points
   - The background flashes green for correct hits, red for wrong clicks
   - The timer counts down; when it reaches zero, the game ends and your score is shown
4. You can restart or return to the home screen at any time.

## Customization

- To change mole emojis or speed/duration options, edit `app/whack-a-mole.tsx`.
- To change the home screen image, replace `assets/images/mole.jpg` with your preferred image.

## Project Structure

- `app/index.tsx` — Home screen
- `app/whack-a-mole.tsx` — Game logic and UI
- `assets/images/` — App images

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)

---

Enjoy playing Whack A Mole!

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
