# StatusBarHeight Capacitor Plugin

This plugin provides a simple way to get the device's status bar height.

## Installation

The plugin is included in the project but if you need to install it in other projects:

```bash
npm install @capacitor/core
```

## Usage

```typescript
import StatusBarHeight from '@/plugins/StatusBarHeightPlugin';

async function getStatusBarHeight() {
  try {
    const result = await StatusBarHeight.getHeight();
    console.log(`Status bar height: ${result.height}px`);
    return result.height;
  } catch (error) {
    console.error('Error getting status bar height:', error);
    return 44; // Default fallback value
  }
}
```

## API

### getHeight()

Returns a promise that resolves with the status bar height in pixels.

```typescript
getHeight(): Promise<{ height: number }>
```

Returns:
- `height` - The height of the status bar in pixels.

## Implementation Details

### Android
Gets the status bar height by accessing the Android resources identifier "status_bar_height".

### iOS
Gets the status bar height from `UIApplication.shared.statusBarFrame.size.height`. 