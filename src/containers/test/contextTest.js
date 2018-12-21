import React from 'react';
import ToolBar from './contextToolbar';
import ToggleButton from './contextToggleButton';
import {ThemeContext }  from './context'


export default  class ContextTest extends React.Component {


    toggleTheme = ()=>{
        const color = this.state.color ;
        let newColor = "green";
        if (color==="green"){
            newColor="red"
        } else{
            newColor="green";
        }
        this.setState({
            color : newColor
        });
    };

    state = {
        color : "green",
        toggleTheme: this.toggleTheme,
    };

    render(){
        return (
            <div>
            <ThemeContext.Provider value={this.state}>
                <ToggleButton />
            </ThemeContext.Provider>
                <ToolBar />
            </div>
        );
    }
}


// export const  ThemeContext = React.createContext("light");