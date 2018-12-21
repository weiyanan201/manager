import React from 'react'
// import {ThemeContext} from './contextTest';
import {ThemeContext} from './context';

class ThemedButton extends React.Component {

    static contextType = ThemeContext;

    render() {
        console.log(this);
        let props = this.props;
        let {color,toggleTheme} = this.context;
        return (
            <button
                {...props}
                style={{backgroundColor: color,width:100,height:100}}
                onClick={toggleTheme}
            />
        );
    }
}
// ThemedButton.contextType = ThemeContext;

export default ThemedButton;