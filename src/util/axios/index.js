import {Modal} from 'antd';
import axios from 'axios';
import qs from 'qs';

// axios.interceptors.request.use(function (config) {
//     console.log("axios.interceptors.request.use");
// });

/**
 * group 下来框
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
            }
        }).catch((error) => {
            Modal.error({
                title: "错误提示",
                content: "系统异常，请联系管理员"
            });
            reject(error);
        })
    });
}

export default class Axios {

     static get(url,params={}) {
        let options = {
            url:url,
            method:'get',
            params:{...params}
        };
        return packPromise(options);
    }

    static post(url,data={}){
        let options = {
            url:url,
            method:'post',
            data:qs.stringify(data),
        };
        return packPromise(options);
    }

    static postByJson(url,data={}){
        let header = {'Content-Type': 'application/json;charset=utf-8'};
        let options = {
            url:url,
            method:'post',
            data:data,
            headers:header
        };
        return packPromise(options);
    }
}



