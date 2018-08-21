import React from 'react'


export default {

    filterData(datas,filterValue,field){
        if (this.isEmpty(filterValue)){
            return datas;
        }else{
            if (this.isEmpty(field)){
                return datas.filter(val=>val.includes(filterValue));
            }else{
                return datas.filter(val=>val[field].includes(filterValue));
            }
        }
    },

    paging(datas,page=1,size=10){
        const start = (page-1)*size+1;
        const end = page*size;
        const newDatas = datas.filter((val,index)=>{
            if(index+1>=start && index+1<=end){
                return val;
            }
        })
        return newDatas;
    },

    /**
     * 判断字符串是否为空
     * @param param
     * @returns {boolean}
     */
    isEmpty(param){
        if (param===undefined || param===null || (param+"").trim()==='' ){
            return true;
        }else{
            return false;
        }
    },

    getWordwrapContent(strings) {
        if (strings === undefined || strings === null || strings.length === 0) {
            return "";
        } else {

            let tmp = [];
            strings.forEach((item,index)=>{
                tmp.push(item);
                tmp.push(<br key={index}/>)
            });
            return <p>{tmp}</p>
        }
    },
    formatDate(ts){
        if (this.isEmpty(ts)){
            return "";
        }
        let date = new Date(ts);
        let y = 1900+date.getYear();
        let m = "0"+(date.getMonth()+1);
        let d = "0"+date.getDate();
        let hour = "0"+date.getHours();
        let min = "0"+date.getMinutes();
        let ss = "0"+date.getSeconds();
        return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+" "+hour.substring(hour.length-2,hour.length)+":"+min.substring(min.length-2,min.length)+":"+ss.substring(ss.length-2,ss.length);
    }

}
