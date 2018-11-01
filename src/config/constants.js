const TenantType = {
    "PLATFORM": {
        key: "PLATFORM",
        text: "系统管理员"
    },
    "GROUP_USER": {
        key: "GROUP_USER",
        text: "组用户"
    },
    "GLOBAL_ANALYST": {
        key: "GLOBAL_ANALYST",
        text: "全局分析师"
    },
    "GLOBAL_DEVELOPER": {
        key: "GLOBAL_DEVELOPER",
        text: "全局开发者"
    },
    "OUTER_SERVICE": {
        key: "OUTER_SERVICE",
        text: "外部服务"
    },
};

const GROUP_PERMISSION = {
    READ_ODS_SCHEMA:"READ_ODS_SCHEMA",
        READ_BUSINESS_SCHEMA:"READ_BUSINESS_SCHEMA",
        WRITE_BUSINESS_SCHEMA:"WRITE_BUSINESS_SCHEMA",
        MODIFY_BUSINESS_SCHEMA:"MODIFY_BUSINESS_SCHEMA",
        SUBMIT_TASK:"SUBMIT_TASK"
};


const StorageType = {
    HIVE:"HIVE",
    HDFS:"HDFS",
    PHOENIX:"PHOENIX",
    HBASE:"HBASE",
    ES:"ES",
    CASSANDRA:"CASSANDRA",
    MYSQL:"MYSQL",
    REDIS:"REDIS"
};

const ProduceType = {
    ODS : "ODS",
    BUSINESS : "BUSINESS",
    PRIVATE : "PRIVATE",
    TEMP : "TEMP"
};

export {
    TenantType,
    GROUP_PERMISSION,
    StorageType,
    ProduceType,
}