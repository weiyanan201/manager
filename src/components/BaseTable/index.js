import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import stateUtil from '../../util/stateUtil'

export default class BaseTable extends React.Component{

    rowSelection={

    };
    componentWillMount(){
        let row_selection = this.props.selection;

        //默认没有选择框
        if (row_selection === undefined ){
            this.rowSelection = null;
        } else {

            let selection = this.props.selection;
            let type = selection.type;
            const ROW_KYES = selection.rowKeys;
            const ROWS = selection.rows;
            let selectedRowKeys = selection._self.state[ROW_KYES];
            this.rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    stateUtil.updateTest(selection._self,{[ROW_KYES]:selectedRowKeys,[ROWS]:selectedRows});
                },
                selectedRowKeys:[]
            };
            if (type === 'checkbox'){
                this.rowSelection.type = 'checkbox';
            } else if(type === 'radio'){
                this.rowSelection.type = 'radio';
            } else {
                //类型不匹配
                this.rowSelection = null;
            }
        }

    }

    componentWillUpdate(){
        if (this.rowSelection!==null){
            const selection = this.props.selection;
            this.rowSelection.selectedRowKeys = selection._self.state[selection.rowKeys]
        }
    }

    onRowClick = (record,index)=>{

        let selection = this.props.selection;
        let type = selection.type;
        const ROW_KYES = selection.rowKeys;
        const ROWS = selection.rows;

        let selectedRowKeys = selection._self.state[ROW_KYES]===undefined?[]:selection._self.state[ROW_KYES];
        let selectedRows = selection._self.state[ROWS]===undefined?[]:selection._self.state[ROWS];
        let itemIndex = selectedRowKeys.findIndex(i=>i===index);

        if (type==="radio"){
            //单选
            if (itemIndex===-1){
                //之前没有选中
                selectedRowKeys = [index];
                selectedRows = [record];
                stateUtil.updateTest(selection._self,{[ROW_KYES]:selectedRowKeys,[ROWS]:selectedRows});
            }
        }else{
            //多选
            if (itemIndex===-1){
                //之前没有选中，加入数组中
                selectedRowKeys.push(index);
                selectedRows.push(record);
                stateUtil.updateTest(selection._self,{[ROW_KYES]:selectedRowKeys,[ROWS]:selectedRows});
            }else{
                //之前选中，反转状态,从数组中删除即可
                selectedRowKeys.splice(itemIndex,1);
                selectedRows.splice(itemIndex,1);
                stateUtil.updateTest(selection._self,{[ROW_KYES]:selectedRowKeys,[ROWS]:selectedRows});
            }
        }

    };

    render(){
        return(
            <Table
                bordered
                {...this.props}
                rowSelection={this.rowSelection}
                onRow={(record, index) => {

                    return {
                        onClick: () => {
                            if (!this.rowSelection){
                                return;
                            }
                            this.onRowClick(record, index);
                        }
                    };
                }}
            />
        );
    }

}

BaseTable.defaultProps = {
    dataSource:[],
    columns:[],
    rowSelection:null,
    selectedRowKeys:[],
    selectedRows:[],
    pagination:null,
    updateTabelSelected:()=>{},
};

BaseTable.propTypes = {
    columns:PropTypes.array.isRequired,
    dataSource:PropTypes.array.isRequired,
    rowSelection:PropTypes.string,
    selectedRowKeys:PropTypes.array,
    selectedRows:PropTypes.array,
    pagination:PropTypes.func,
    updateTabelSelected:PropTypes.func,
    selection:PropTypes.shape({
        type: PropTypes.string.isRequired,
        rowKeys: PropTypes.string.isRequired,
        rows:PropTypes.string.isRequired,
        _self:PropTypes.object.isRequired,
    }),
    rowKey:PropTypes.string.isRequired,

};
