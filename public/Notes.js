let data = {
    tableId: 1, //表单id
    workFlowVersionId: "工作流版本号",
    directorMaxLevel: "主管的最高等级",
    workFlowDef: {
        //工作流相关信息
        name: "合同审批", //流程名称
        sortNo: "1", //表单的分类ID
        status: 1, //工作流是否禁用
    },
    fromData: [], //表单数据
    flowPermission: [], //可以发起流程的人
    nodeConfig: [
        {
            //发起人
            type: 0, //"节点类型：0发起人，1审批人，2抄送人，3条件，4路由",
            nodeFromData: [], //"该节点的表单权限",
        },
        {
            //审批人
            type: 1, //"节点类型：0发起人，1审批人，2抄送人，3条件，4路由",
            settype: "审批人节点设置：1制定成员，2主管，4发起人自选，5发起人自己，7连续多级主管",
            directorLevel: "主管等级：1直接主管，2第2级主管，3第3级主管，4第4级主管...",
            examineMode: "多人审批时采用的审批方式：1依次审批，2会签",
            selectMode: "选择模式：0为空，1选择人，2选多人",
            selectRange: "选择范围：0为空，1全公司，2指定成员，3指定角色",
            nodeUserList: "发起人从指定角色中选择的列表",
            noHanderAction: "审批人为空时的操作：1是自动审批通过/不允许发起，2是转交给审核管理员",
            examineEndDirectorLevel: "多级主管审核时的结束层级",
            nodeFromData: [], //"该节点的表单权限",
        },
        // 条件
        {
            type: 3,
            priorityLevel: 1, //优先级
        },
    ],
};
