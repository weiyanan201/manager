import React from 'react'

import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';
import Toolbar from './theme-tool'

// An intermediate component that uses the ThemedButton


export default class App extends React.Component {

    render() {
        // The ThemedButton button inside the ThemeProvider
        // uses the theme from state while the one outside uses
        // the default dark theme
        return (
            <div>
                <ThemeContext.Provider value={themes.dark}>
                    <Toolbar  />
                </ThemeContext.Provider>
                <div>
                    <ThemedButton />
                </div>
            </div>
        );
    }
}