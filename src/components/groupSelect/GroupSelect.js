import React from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';


const {Option} = Select;

const GroupSelect = ({groupData=[],handleChange}) => {

    const children = [];

    groupData.map(group=>{
        children.push(<Option key={group.groupId}>{group.groupName}</Option>);
    });

    return (
        <Select style={{width: 200}}
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                onSelect={handleChange}
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
}

export default GroupSelect;