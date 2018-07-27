/**
 * return map ;
 */
function getParams(getUrl){
    // const getUrl = "/searchGroup?ID=12345&name=weiyanan";
    ///searchGroup?ID=12345&name=weiyanan

    const array = getUrl.split("?");
    let m = new Map();

    if(array.length==2){
        const args = array[1];
        args.split('&').map(x=>{
            let ss = x.split("=");
            m.set(ss[0],ss[1]);
        })
    }
    return m;
}

/**
 * return map;
 */
function postParams(body){
    let m = new Map();
    for(let key in body){
        m.set(key,body[key]);
    }
    return m;
}

/**
 *
 * @param datas
 * @param page
 * @param size
 * @returns datas
 */
function paging(datas,page=1,size=10){

    const start = (page-1)*size+1;
    const end = page*size;
    const newDatas = datas.filter((val,index)=>{
        if(index+1>=start && index+1<=end){
            return val;
        }
    })
    return newDatas;
}


module.exports = {
    getParams:getParams,
    postParams:postParams,
    paging:paging

}