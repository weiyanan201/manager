/**
 * 权限穿梭框
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';

import util from "../../../../util/util";
import { handleAllCheck,handleCheck,handleMove, handleSearch, modalToggle,handleSubmit, updateDataSource,ANALYST,DEVELOPER,CLEAR,LEFT,RIGHT } from "../../../../reducers/tenant.redux";

@connect(
    state => state.tenantPermission,
    {handleAllCheck , handleCheck ,handleMove, handleSearch,modalToggle,handleSubmit, updateDataSource}
)
class PermissionTransfer extends Component {

    render() {
        const props = this.props;
        return (
          <div>
            <Button type="primary" onClick={()=>props.modalToggle(true)}>编辑用户所在的组</Button>

            <Modal title="编辑组权限"
                   visible={props.modalVisible}
                   width={800}
                   onCancel={() => props.modalToggle(false)}
                   onOk={()=>props.handleSubmit(props.tenantId,props.has)}
                   destroyOnClose={true}
                   maskClosable={false}
                   confirmLoading={ props.okLoading }
            >

              <div className="ant-transfer">
                {/*左边内容*/}
                <div className="ant-transfer-list" style={{width: "300px",height: "300px"}}>
                    <div className="ant-transfer-list-header">
                        <label className="ant-checkbox-wrapper" onChange={()=>props.handleAllCheck(LEFT)}>
                            <span className={`ant-checkbox ${props.leftAllChecked?'ant-checkbox-checked':''}`}>
                                <input type="checkbox" className="ant-checkbox-input" value />
                                <span className="ant-checkbox-inner" />
                            </span>
                        </label>
                        <span className="ant-transfer-list-header-selected" >
                            <span>{`${props.rest.length} 项`}</span>
                            <span className="ant-transfer-list-header-title"/>
                        </span>
                    </div>
                    <div className="ant-transfer-list-body ant-transfer-list-body-with-search">
                        <div className="ant-transfer-list-body-search-wrapper">
                            <div>
                                <input placeholder="请输入搜索内容"
                                       className="ant-input ant-transfer-list-search"
                                       type="text"
                                       onChange={(e)=>props.handleSearch(e.target.value,LEFT)}
                                       value={props.leftSearch}
                                />
                                {
                                    util.isEmpty(props.leftSearch)?
                                        <span className="ant-transfer-list-search-action">
                                              <i className="anticon anticon-search">
                                                <svg viewBox="64 64 896 896" className="" data-icon="search" width="1em"
                                                     height="1em" fill="currentColor" aria-hidden="true">
                                                    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
                                                </svg>
                                              </i>
                                          </span>
                                        :
                                        <a className="ant-transfer-list-search-action" onClick={()=>props.handleSearch("",LEFT)}>
                                            <i className="anticon anticon-close-circle">
                                                <svg viewBox="64 64 896 896" className="" data-icon="close-circle"
                                                     width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                    <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z" />
                                                    <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                                                </svg>
                                            </i>
                                        </a>
                                }
                            </div>
                        </div>
                        <ul className="ant-transfer-list-content">
                            <div className="LazyLoad is-visible" style={{height: "32px"}}>
                                {
                                    props.rest.map(item=>(
                                        item.name.indexOf(props.leftSearch)!==-1?
                                            <li className="ant-transfer-list-content-item" title="content1" onClick={()=>props.handleCheck(item.id,LEFT)} key={item.id}>
                                                <label className="ant-checkbox-wrapper" >
                                                    <span className={`ant-checkbox ${props.leftChecked.includes(item.id)?'ant-checkbox-checked':''}`}>
                                                        <input type="checkbox" className="ant-checkbox-input" value={item.id} />
                                                        <span className="ant-checkbox-inner"/>
                                                    </span>
                                                </label>
                                                <span>
                                                    <span className="custom-item">
                                                        {item.name}
                                                    </span>
                                                </span>
                                            </li>
                                            : null
                                    ))
                                }
                            </div>
                        </ul>
                    </div>
                </div>
                {/*中间按钮去*/}
                <div className="ant-transfer-operation">
                    <button type="button" className="ant-btn ant-btn-primary ant-btn-sm"  disabled={props.leftChecked.length===0} onClick={()=>props.handleMove(ANALYST)}>
                        <i className="anticon anticon-right">
                            <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em"
                                 fill="currentColor" aria-hidden="true">
                                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z" />
                            </svg>
                        </i>
                        <span>添加分析师权限</span>
                    </button>

                    <button type="button" className="ant-btn ant-btn-primary ant-btn-sm"  disabled={props.leftChecked.length===0} onClick={()=>props.handleMove(DEVELOPER)}>
                        <i className="anticon anticon-right">
                            <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em"
                                 fill="currentColor" aria-hidden="true">
                                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z" />
                            </svg>
                        </i>
                        <span>添加开发者权限</span>
                    </button>

                    <button type="button" className="ant-btn ant-btn-primary ant-btn-sm" disabled={props.rightChecked.length===0} onClick={()=>props.handleMove(CLEAR)}>
                        <i className="anticon anticon-left">
                            <svg viewBox="64 64 896 896" className="" data-icon="left" width="1em" height="1em"
                                 fill="currentColor" aria-hidden="true">
                                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" />
                            </svg>
                        </i>
                        <span>移除权限</span>
                    </button>

                </div>

                {/*右边内容*/}
                  <div className="ant-transfer-list" style={{width: "300px", height: "300px"}}>
                      <div className="ant-transfer-list-header">
                          <label className="ant-checkbox-wrapper" onChange={()=>props.handleAllCheck(RIGHT)}>
                            <span className={`ant-checkbox ${props.rightAllChecked?'ant-checkbox-checked':''}`}>
                                <input type="checkbox" className="ant-checkbox-input" value/>
                                <span className="ant-checkbox-inner"/>
                            </span>
                          </label>
                          <span className="ant-transfer-list-header-selected">
                            <span>{`${props.has.length} 项`}</span>
                            <span className="ant-transfer-list-header-title"/>
                        </span>
                      </div>
                      <div className="ant-transfer-list-body ant-transfer-list-body-with-search">

                          <div className="ant-transfer-list-body-search-wrapper">
                              <div>
                                  <input placeholder="请输入搜索内容"
                                         className="ant-input ant-transfer-list-search"
                                         type="text"
                                         onChange={(e)=>props.handleSearch(e.target.value,RIGHT)}
                                         value={props.rightSearch}/>
                                  {
                                      util.isEmpty(props.rightSearch)?
                                          <span className="ant-transfer-list-search-action">
                                              <i className="anticon anticon-search">
                                                <svg viewBox="64 64 896 896" className="" data-icon="search" width="1em"
                                                    height="1em" fill="currentColor" aria-hidden="true">
                                                    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
                                                </svg>
                                              </i>
                                          </span>
                                          :
                                          <a className="ant-transfer-list-search-action" onClick={()=>props.handleSearch("",RIGHT)}>
                                              <i className="anticon anticon-close-circle">
                                                  <svg viewBox="64 64 896 896" className="" data-icon="close-circle"
                                                       width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                      <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z" />
                                                      <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                                                  </svg>
                                              </i>
                                          </a>
                                  }

                              </div>
                          </div>

                          <ul className="ant-transfer-list-content">
                              <div className="LazyLoad is-visible" style={{height: "32px"}}>

                                  {
                                      props.has.map(item=>(
                                          item.name.indexOf(props.rightSearch)!==-1?
                                              <li className="ant-transfer-list-content-item" title="content1" onClick={()=>props.handleCheck(item.id,RIGHT)}  key={item.id}>
                                                  <label className="ant-checkbox-wrapper" >
                                                        <span className={`ant-checkbox ${props.rightChecked.includes(item.id)?'ant-checkbox-checked':''}`}>
                                                            <input type="checkbox" className="ant-checkbox-input" value={item.id} />
                                                            <span className="ant-checkbox-inner"/>
                                                        </span>
                                                  </label>
                                                  <span>
                                                        <span className="custom-item">
                                                            {item.name}-{`${item.type===ANALYST?'分析师':'开发者'}`}
                                                        </span>
                                                    </span>
                                              </li>:null
                                      ))
                                  }
                              </div>
                          </ul>
                      </div>
                  </div>
              </div>

            </Modal>
          </div>

        );
    }
}

export default PermissionTransfer;

