import {Modal} from 'antd';
import axios from 'axios';
import qs from 'qs';

import host from '../../config/host';
import util from "../util";

const baseUrl = host;

axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config
})

// axios.interceptors.request.use(function (config) {
//     console.log("axios.interceptors.request.use");
// });

/**
 * @param options
 * @returns {Promise<any>}
 */

function packPromise(options){
    return new Promise((resolve, reject) => {
        axios({...options}).then((response) => {
            if (response.status === 200) {
                let data = response.data;
                if (data.returnCode === 0) {
                    resolve(response);
                } else {
                    Modal.error({
                        title: "错误提示",
                        content: data.returnMessage
                    });
                    reject(response);
                }
            } else {
                //TODO 其他status处理
                reject(response);
            }
        }).catch((error) => {
            console.error(error);
            const response = error.response;
            if (response && response.status===401){
                const location = response.headers['location'];
                if (location){
                    window.location = location;
                }
                // Modal.error({
                //     title: "错误提示",
                //     content: "会话失效，请重新登录",
                // });
            }else{
                let errorMsg = "系统异常，请联系管理员";
                if (!util.isEmpty(response.data.msg)){
                    errorMsg = `msg : ${response.data.msg} ;
                    status : ${response.data.status}
                    `;
                }
                Modal.error({
                    title: "错误提示",
                    content: errorMsg
                });
            }
            reject(error);
        })
    });
}

export default class Axios {

     static get(url,params={}) {
        let options = {
            url:baseUrl+url,
            method:'get',
            params:{...params}
        };
        return packPromise(options);
    }

    static post(url,data={}){
        let options = {
            url:baseUrl+url,
            method:'post',
            data:qs.stringify(data),
        };
        return packPromise(options);
    }

    static postByJson(url,data={}){
        let header = {'Content-Type': 'application/json;charset=utf-8'};
        let options = {
            url:baseUrl+url,
            method:'post',
            data:data,
            headers:header
        };
        return packPromise(options);
    }
}



