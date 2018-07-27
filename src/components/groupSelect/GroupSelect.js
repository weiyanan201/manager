import React from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';


const {Option} = Select;

const GroupSelect = ({groupData=[],handleChange,handleSearch}) => {

    const children = [];

    groupData.map(group=>{
        children.push(<Option key={group.id}>{group.name}</Option>);
    });

    return (
        <Select style={{width: 200}}
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                onSelect={handleChange}
                onSearch={handleSearch}
                optionLabelProp={children.groupName}
                showArrow={true}
                allowClear = {true}
                mode="combobox"
                optionLabelProp="children"    //combobox配合使用，使选中option时显示value
        >
            {children}
        </Select>
    );
};

GroupSelect.propTypes = {
    groupData:PropTypes.array,
    handleChange:PropTypes.func,
    handleSearch:PropTypes.func
}

export default GroupSelect;