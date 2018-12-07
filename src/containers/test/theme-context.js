import React from 'react'

export const themes = {
    light: {
        foreground: '#ff160c',
        background: '#3aee83',
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
    },
};

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const ThemeContext = React.createContext({
    theme: themes.dark,
    toggleTheme: () => {},
});