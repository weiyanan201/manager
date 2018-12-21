import React from 'react'


import {Table, Divider, Tag,Form,Input,Button} from 'antd';


const FormItem = Form.Item;
 class TestTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isTmp:true,
            columns: [{
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (record,row) => {
                    console.log(record,row);
                    return(
                        <Form>
                            <FormItem>
                                {
                                    this.props.form.getFieldDecorator("name"+row.key,{
                                        // validateTrigger: ['onChange', 'onBlur'],
                                        // force:true,
                                        rules:[
                                            {
                                                required : this.state.isTmp,
                                                message : '必填'
                                            }
                                        ],
                                        initialValue:row.name
                                    })(
                                        <Input style={{width:100}}/>
                                    )
                                }
                            </FormItem>
                        </Form>
                    )
                }
            }, {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            }, {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            }, ],

            data: [{
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                tags: ['nice', 'developer'],
            }, {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                tags: ['loser'],
            }, {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                tags: ['cool', 'teacher'],
            }]

        }
    }

     handleButton = () =>{
        console.log("this",this.props.form.getFieldsValue());
         this.props.form.validateFields( { force: true });
         this.props.form.validateFields((error, values) => {
             console.log("validate");
             if (error) {
                 console.log("error");
             }
         })
    }
     handleTmp=()=>{
        const isTmp = this.state.isTmp;
        this.setState({
            isTmp:!isTmp
        })
     }

    render() {
        return (
            <div>
                <Table columns={this.state.columns} dataSource={this.state.data}/>
                <Button onClick={this.handleButton}>xxxx</Button>
                <Button onClick={this.handleTmp}>tmp</Button>
            </div>
        )
    }
}

const TestTableForm = Form.create()(TestTable);


export default TestTableForm