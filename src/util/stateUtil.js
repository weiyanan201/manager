
import React from 'react';

export default {

    updateTabelSelected(selectedRowKeys, selectedRows){
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    },

    updateTest(_this,stateObject){
        _this.setState({
            ...stateObject
        })
    }

}

