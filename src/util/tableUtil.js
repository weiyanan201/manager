import React from 'react';

import { TenantType,GROUP_PERMISSION,TEMP_GROUP_ID,StorageType ,DB_USAGE} from './config';

export default {

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
        console.log(resutl);
        return resutl;
    }
}