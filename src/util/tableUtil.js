import React from 'react';

import { TenantType,GROUP_PERMISSION,TEMP_GROUP_ID,StorageType ,DB_USAGE,HIVE_STORAGE_FORMAT} from './config';

export default {

    /**
     *过滤有编辑权限的组
     */
    filterGroup (group,role){
        if (TenantType.PLATFORM===role){
            return group ;
        }else{
            let newGroup = [];
            group.map((item)=>{
                if ( item.permissions && item.permissions.includes(GROUP_PERMISSION.MODIFY_BUSINESS_SCHEMA)){
                    newGroup.push(item) ;
                }else if(TEMP_GROUP_ID===item.id){
                    newGroup.push(item);
                }
            });
            return newGroup;
        }
    },
    getStorageType(){
        return StorageType;
    },
    getStorageFormat(){
        return HIVE_STORAGE_FORMAT;
    },
    fiterDbs(dbs,group,storageType,role){
        if (!dbs || !storageType || !role){
            return [];
        }else{
            if (TenantType.PLATFORM===role){
                return dbs[storageType];
            }else{
                let tempDBs = dbs[storageType];
                if (group==TEMP_GROUP_ID) {
                    return tempDBs.filter((item)=>item.usage===DB_USAGE.TEMP);
                }else{
                    let tempDBs = dbs[storageType];
                    return tempDBs.filter((item)=>{
                        if (item.usage===DB_USAGE.BUSINESS){
                            return item;
                        }
                    });
                }

            }
        }
    },
    getFieldType(fields,type){
        let resutl = [];
        let children = [];
        if (fields && fields.length>0){
            fields.map(item=>{
                if (item.type.includes(type) && item.elementary){
                    resutl.push({
                        value:item.name,
                        label:item.name
                    });
                    children.push({
                        value:item.name,
                        label:item.name
                    });

                }else if(item.type.includes(type) ){
                    let combination = {
                        value:item.name,
                        label:item.name,
                        children:children
                    }
                    resutl.push(combination)
                }
            });
        }
        return resutl;
    },

    fieldTypeRender(label){
        if (label && label.length===2){
            return `${label[0]}<${label[1]}>`
        }else if(label){
            return label[0];
        }
    },
    /**
     * @param type
     * @return []
     */
    fieldTypeDeser(type){
        if (type.includes("<")){
            //复合类型
            let beginIndex = type.indexOf("<");
            let endIndex = type.indexOf(">");
            let array = [];
            array.push(type.substring(0,beginIndex));
            array.push(type.substring(beginIndex+1,endIndex));
            return array;
        } else{
            return [type];
        }
    },
    /**
     * @param legalTypes  合法的类型（getFieldType中获取）
     * @param type 待校验的字段类型 []
     */
    checkoutFieldType(legalTypes,type){
        if (legalTypes===undefined || legalTypes===null || legalTypes.length===0){
            return false;
        }
        if (type  && type.length===1){
            return legalTypes.filter(item=>item.value===type[0]).length > 0;
        }else if(type  && type.length===2){
            let fi = type[0];
            let si = type[1];
            if (legalTypes.filter(item=>item.value===fi).length > 0){
                let second = legalTypes.filter(item=>item.value===fi)[0].children;
                return second && second.filter(i=>i.value===si).length>0;
            }
        }
        return false;
    },
}