import React from 'react';
import PropTypes from 'prop-types';
import {Select,Input} from 'antd';


const {Option} = Select;
const Search = Input.Search;

// const GroupSelect = ({groupData=[],handleChange,handleSearch}) => {

export default class GroupSelect extends React.Component{


   render(){
       const children = [];

       this.props.groupData.map(group=>{
           children.push(<Option key={group.id}>{group.name}</Option>);
       });
       return (
           <Select style={{width: 200}}
                   showSearch
                   placeholder="Select a person"
                   optionFilterProp="children"
                   onSelect={this.props.handleChange}
                   onSearch={this.props.handleSearch}
                   optionLabelProp={children.groupName}
                   showArrow={true}
                   allowClear = {true}
                   mode="combobox"
                   optionLabelProp="children"    //combobox配合使用，使选中option时显示value
                   {...this.props}
           >
               {children}
           </Select>
       );
   }

};

GroupSelect.propTypes = {
    groupData:PropTypes.array,
    handleChange:PropTypes.func,
    handleSearch:PropTypes.func
}

