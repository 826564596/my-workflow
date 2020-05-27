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
            nodeFromData: [], //"该节点的表单权限",{power:1},0:可编辑，1：只读，2：隐藏
            nodeName: "发起人", //节点名称,
            childNode: [], //子节点，类型为1，或2
        },
        {
            //审批人
            type: 1, //"节点类型：0发起人，1审批人，2抄送人，3条件，4路由",
            nodeFromData: [], //"该节点的表单权限",
            nodeName: "审批人", //节点名称
            settype: 1, //"审批人节点设置：1制定成员，2主管，4发起人自选，5发起人自己，7连续多级主管",
            directorLevel: 4, //"主管等级：1直接主管，2第2级主管，3第3级主管，4第4级主管...",
            examineMode: 1, //"多人审批时采用的审批方式：1依次审批，2会签",
            selectMode: 1, //"选择模式：0为空，1选择人，2选多人",
            selectRange: 1, // "选择范围：0为空，1全公司，2指定成员，3指定角色",
            nodeUserList: [], //发起人从指定角色中选择的列表, 相关人员列表{type:1,targetId:"",name:""},type类型:1,组织架构。2，角色。,
            noHanderAction: 1, //"审批人为空时的操作：1是自动审批通过/不允许发起，2是转交给审核管理员",
            examineEndDirectorLevel: 1, //"多级主管审核时的结束层级",
            childNode: [], //子节点，类型为1,2,3,4,
            error: false, //校验通过标志
        },

        {
            // 条件节点
            type: 3, //"节点类型：0发起人，1审批人，2抄送人，3条件，4路由",
            priorityLevel: 1, //条件优先级
            conditionList: [], //条件列表
            nodeUserList: [], //节点用户列表，用于判断
            conditionNodes: [],
            childNode: [], //子节点
            error: false,
        },

        {
            //抄送人节点
            nodeName: "抄送人", //节点名称
            type: 2, //"节点类型：0发起人，1审批人，2抄送人，3条件，4路由",
            ccSelfSelectFlag: 1, //发起人自选标志，0不能自选，1可以自选
            childNode: null, //子节点
            nodeUserList: [], //相关人员列表{type:1,targetId:"",name:""},type类型:1,组织架构。2，角色。
            error: false,
        },

        {
            //路由节点
            nodeName: "路由", //节点名称
            type: 4, //"节点类型：0发起人，1审批人，2抄送人，3条件，4路由",
            childNode: [], //子节点
            conditionNodes: [], //条件子节点,类型为3
        },
    ],
};

const conditionList = [
    {
        columnId: 1, //唯一标识
        type: 2, //类型1：发起人,类型2：option（小于，2：大于，3：小于等于，4：等于，5：大于等于，6：介于两数之间）
        optType: 1, //类型1:小于，2：大于，3：小于等于，4：等于，5：大于等于，6：介于两数之间
        zdy1: "", //optType：1~5只需要zdy1，如果optType=6，则需要zdy1和zdy2
        zdy2: "",
        opt1: "", //optType：1~5只需要opt1，如果optType=6，则需要opt1和opt2
        opt2: "",
        columnType: 0, //分为Double为0 和String 为 1
        showType: "", //展示类型
        showName: "金额", //显示名称
        fixedDownBoxValue: [], //单选框数据
    },
];
