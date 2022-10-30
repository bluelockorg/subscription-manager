import { Keyboard, KeyboardStyle } from '@capacitor/keyboard';
import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';

export const changeTheme = async (t: string) => {
  if (t === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.classList.toggle("dark", prefersDark.matches);
    if (prefersDark.matches) {
      StatusBar.setStyle({ style: Style.Dark });
    } else {
      StatusBar.setStyle({ style: Style.Light });
    }
  } else {
    document.body.classList.toggle("dark", t === "dark");
    if (t === "dark") {
      Keyboard.setStyle({ style: KeyboardStyle.Dark });
      StatusBar.setStyle({ style: Style.Dark });
    } else {
      Keyboard.setStyle({ style: KeyboardStyle.Light });
      StatusBar.setStyle({ style: Style.Light });
    }
  }
  await Preferences.set({
    key: "darkTheme",
    value: t,
  });
};
