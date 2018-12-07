import React, { Component } from 'react';
import CardItem from './CardItem'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import style from './App.less';


import ThemedButton from './themed-button';

import {ThemeContext, themes} from './theme-context';
import ThemeTogglerButton from './theme-toggler-button';



function Toolbar(props) {
    return (
        <ThemedButton onClick={props.changeTheme}>
            Change Theme
        </ThemedButton>
    );
}
class App extends React.Component {
    constructor(props) {
        super(props);

        this.toggleTheme = () => {
            this.setState(state => ({
                theme:
                    state.theme === themes.dark
                        ? themes.light
                        : themes.dark,
            }));
        };

        // State also contains the updater function so it will
        // be passed down into the context provider
        this.state = {
            theme: themes.light,
            toggleTheme: this.toggleTheme,
        };
    }

    render() {
        // The entire state is passed to the provider
        return (
            <ThemeContext.Provider value={this.state}>
                <ThemeTogglerButton />
            </ThemeContext.Provider>
        );
    }
}

function Content() {
    return (
        <div>
            <ThemeTogglerButton />
        </div>
    );
}

export default App;

const CardList = [{ //定义卡片内容
    title:"first Card",
    id:1,
    content:"this is first Card"
},{
    title:"second Card",
    id:2,
    content:"this is second Card"
},{
    title:"Third Card",
    id:3,
    content:"this is Third Card"
}
];
class Test extends Component {
    state = {
        CardList
    };

    handleDND = (dragIndex,hoverIndex) => {
        let CardList = this.state.CardList;
        let tmp = CardList[dragIndex] //临时储存文件
        CardList.splice(dragIndex,1) //移除拖拽项
        CardList.splice(hoverIndex,0,tmp) //插入放置项
        this.setState({
            CardList
        })
    };
    render() {
        return (
            <div>
                <div className={style.card}>
                    {this.state.CardList.map((item,index) => {
                        return(
                            <CardItem //向次级界面传递参数
                                key={item.id}
                                title={item.title}
                                content={item.content}
                                index={index}
                                onDND={this.handleDND}
                            />
                        )
                    })}
                </div>
                <div>

                </div>
            </div>
        );
    }
}

// export default DragDropContext(HTML5Backend)(Test);