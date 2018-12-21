import React from 'react'
import {ThemeContext} from './context';

class ToggleButton extends React.Component {

    render(){
        return (
            <ThemeContext.Consumer>
                {
                    ({color,toggleTheme})=>(
                        <button
                            {...this.props}
                            style={{backgroundColor: color,width:100,height:100}}
                            onClick={toggleTheme}
                        />
                    )
                }
            </ThemeContext.Consumer>
        );
    }
}

export default ToggleButton;