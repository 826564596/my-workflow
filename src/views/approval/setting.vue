<template>
    <div>
        <!-- 头部 -->
        <div class="fd-nav">
            <div class="fd-nav-left">
                <div class="fd-nav-back" @click="toReturn">
                    <i class="anticon anticon-left"></i>
                </div>
                <div class="fd-nav-title">{{workFlowDef.name}}</div>
            </div>
            <div class="fd-nav-center">
                <div class="fd-nav-container">
                    <div class="ghost-bar" :style="`transform: translateX(${location}px);`"></div>
                    <div @click="change(1)" :class="'fd-nav-item' + ' ' + (location == 0 ? 'active' : '')"><span class="order-num">1</span>基础设置</div>
                    <div @click="change(2)" :class="'fd-nav-item' + ' ' + (location == 150 ? 'active' : '')"><span class="order-num">2</span>表单设计</div>
                    <div @click="change(3)" :class="'fd-nav-item' + ' ' + (location == 300 ? 'active' : '')"><span class="order-num">3</span>流程设计</div>
                    <div @click="change(4)" :class="'fd-nav-item' + ' ' + (location == 450 ? 'active' : '')"><span class="order-num">4</span>高级设置</div>
                </div>
            </div>
            <div class="fd-nav-right">
                <button type="button" class="ant-btn button-preview"><span>预 览</span></button>
                <button type="button" class="ant-btn button-publish" @click="saveSet">
                    <span>发 布</span>
                </button>
            </div>
        </div>
        <!-- 基础设置主体 -->
        <div class="fd-nav-content" v-if="location == 0">
            000
        </div>
        <!-- 表单设计主体 -->
        <div class="fd-nav-content" v-if="location == 150">
            150
        </div>
        <!-- 流程节点主体 -->
        <div class="fd-nav-content" v-if="location == 300">
            <section class="dingflow-design">
                <div class="zoom">
                    <div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)"></div>
                    <span>{{nowVal}}%</span>
                    <div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)"></div>
                </div>
                <div class="box-scale" id="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'">
                    <nodeWrap :nodeConfig.sync="nodeConfig" :formData.sync="formData" :flowPermission.sync="flowPermission" :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel" :tableId="tableId"></nodeWrap>
                    <div class="end-node">
                        <div class="end-node-circle"></div>
                        <div class="end-node-text">流程结束</div>
                    </div>
                </div>
            </section>
        </div>
        <!-- 高级设计 -->
        <div class="fd-nav-content" v-if="location == 450">
            450
        </div>
        <!-- 提示 -->
        <el-dialog title="提示" :visible.sync="tipVisible">
            <div class="ant-confirm-body">
                <i class="anticon anticon-close-circle" style="color: #f00;"></i>
                <span class="ant-confirm-title">当前无法发布</span>
                <div class="ant-confirm-content">
                    <div>
                        <p class="error-modal-desc">以下内容不完善，需进行修改</p>
                        <div class="error-modal-list">
                            <div class="error-modal-item" v-for="(item,index) in tipList" :key="index">
                                <div class="error-modal-item-label">流程设计</div>
                                <div class="error-modal-item-content">{{item.name}} 未选择{{item.type}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tipVisible = false">我知道了</el-button>
                <el-button type="primary" @click="tipVisible = false">前往修改</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

export default {
    components: {},
    data() {
        return {
            isTried: false,//每个节点是否通过校验
            tipList: [],//遍历nodeConfig之后的不符合提示
            tipVisible: false, //流程校验提示
            nowVal: 100, //初始大小
            processConfig: {},
            nodeConfig: {}, //节点信息
            workFlowDef: {}, //工作流相关信息
            flowPermission: [], //可以发起流程的人
            directorMaxLevel: 0, //主管的最高等级
            dialogVisible: true, //判断流程是否可以发布的对话框 隐藏显示参数
            tableId: "", //表单id
            formData: [], //表单数据
            location: 300
        };
    },
    created() {
        this.$axios
            // .get("/data.json", {
            .get("/newData.json", {
                workFlowDefId: this.$route.params.workFlowDefId
            })
            .then(res => {
                this.processConfig = res.data;
                this.nodeConfig = this.processConfig.nodes;
                this.flowPermission = this.processConfig.flowPermissions;
                this.directorMaxLevel = this.processConfig.directorMaxLevel;
                this.workFlowDef.name = this.processConfig.forms.formName;
                this.tableId = this.processConfig.tableId;
                this.formData = this.processConfig.forms.components;
                // console.log(this.nodeConfig);
            });
    },
    methods: {
        change(a) {
            this.location = (a - 1) * 150;
        },
        toReturn() {
            //window.location.href = ""
        },
        //递归遍历nodeConfig,每次设置相关节点时会保存error
        reErr(data) {
            console.log("reErr");
            if (data.childNode) {
                if (data.childNode.type == 1) {
                    //审批人
                    if (data.childNode.error) {
                        this.tipList.push({
                            name: data.childNode.nodeName,
                            type: "审核人"
                        });
                    }
                    this.reErr(data.childNode);
                } else if (data.childNode.type == 2) {
                    //抄送人
                    if (data.childNode.error) {
                        this.tipList.push({
                            name: data.childNode.nodeName,
                            type: "抄送人"
                        });
                    }
                    this.reErr(data.childNode);
                } else if (data.childNode.type == 3) {
                    //条件节点
                    this.reErr(data.childNode.childNode);
                } else if (data.childNode.type == 4) {
                    //路由节点
                    this.reErr(data.childNode);
                    for (let i = 0; i < data.childNode.conditionNodes.length; i++) {
                        if (data.childNode.conditionNodes[i].error) {
                            this.tipList.push({
                                name: data.childNode.conditionNodes[i].nodeName,
                                type: "条件"
                            });
                        }
                        this.reErr(data.childNode.conditionNodes[i]);
                    }
                }
            } else {
                data.childNode = null;
            }
        },
        //保存流程设置
        saveSet() {
            this.isTried = true;
            this.tipList = [];
            this.reErr(this.nodeConfig);
            if (this.tipList.length != 0) {
                this.tipVisible = true;
                return;
            }
            this.processConfig.flowPermissions = this.flowPermission;
            let processConfig = JSON.parse(JSON.stringify(this.processConfig));
            console.log(JSON.stringify(this.processConfig));
            processConfig.nodes = [this.merge(processConfig.nodes)];

            let nodesCal = this.ergodicNodeConfig(processConfig.nodes[0]);
            console.log(nodesCal);
            // this.$axios.post("/api/Forms/Save", processConfig).then(response => {
            //     console.log(response);
            // })
            processConfig.nodesCal = nodesCal;
            this.$axios.post(" /api/Forms/Submit", processConfig).then(response => {
                console.log(response);
            })

        },
        //修改整体大小
        zoomSize(type) {
            if (type == 1) {
                if (this.nowVal == 50) {
                    return;
                }
                this.nowVal -= 10;
            } else {
                if (this.nowVal == 300) {
                    return;
                }
                this.nowVal += 10;
            }
        },
        //遍历一整颗树，合并每个节点的conditionNodes和ChildNodes
        merge(node) {
            node.childNodes = [];
            node.childNode && node.childNodes.push(node.childNode);
            //如果有条件子节点并且长度大于0
            if (node.conditionNodes && node.conditionNodes.length > 0) {
                for (let len = node.conditionNodes.length, i = 0; i < len; i++) {
                    let childnode = this.merge(node.conditionNodes[i]);
                    node.childNodes.splice(i, 0, childnode);
                }
            }
            //如果有条件子节点并且长度大于0
            else if (node.childNode) {
                this.merge(node.childNode);
            }
            //归---判断是否是路由节点，子节点
            if (node.type == 4) {
                this.merge(node.childNodes[node.childNodes.length - 1]);
            }
            delete node.childNode;
            delete node.conditionNodes;
            return node;
        },


        //////////////////////////遍历数据nodeConfig
        ergodicNodeConfig(node, showName = "金额", value = 1, options = [{ label: '选项1', key: 0 }]) {
            // let node = nodeConfig;
            let nodes = [];
            node = this.ergodicTree(node, showName, value, options, nodes);
            node.forEach((item, index) => {
                delete item.childNodes;
            })
            return node;
        },
        ergodicTree(node, showName, value, options, nodes) {
            console.log(node);
            let conditionNodes = [];

            if (node.type == 0 || node.type == 1 || node.type == 2) { nodes.push(node); }
            else if (node.type == 4) { conditionNodes = node.childNodes.slice(0, node.childNodes.length - 1); }
            let childNode = node.childNodes.slice(node.childNodes.length - 1);


            //判断是否是路由节点，把路由节点的子节点和条件子节点分开
            if (conditionNodes.length > 0) {
                for (let i = 0, len = conditionNodes.length; i < len; i++) {
                    if (this.judgeCondition(conditionNodes[i], showName, value, options, nodes)) {
                        this.ergodicTree(conditionNodes[i], showName, value, options, nodes);
                    }
                }
            }
            else if (childNode.length > 0) {
                this.ergodicTree(childNode[0], showName, value, options, nodes);
            }
            //需要注意路由节点的最后一个子节点为往下走的路径
            if (node.type == 4) {
                this.ergodicTree(node.childNodes[node.childNodes.length - 1], showName, value, options, nodes);
            }
            return nodes;
        },
        //根据conditionList和nodeUserList判断
        judgeCondition(conditionNodes, showName, value, options) {
            //根据conditionList里的条件判断输入值是否满足条件
            return conditionNodes.conditionList.some((item, index) => {
                //如果是发起人
                // if (item.columnId == 0) {

                // }
                //如果是单选框
                if (item.columnType == 1 && item.showType == "3") {
                    return item.zdy1.split(",").indexOf(options[0].key + '');
                }
                //如果涉及运算符
                if (item.columnType == 0) {
                    let str = "";
                    if (item.optType != 6 && item.zdy1) {
                        let optTypeStr = ["", "<", ">", "<=", "==", ">="][item.optType];
                        str = `${value} ${optTypeStr} ${item.zdy1}`;
                    }
                    else if (item.optType == 6 && item.zdy1 && item.zdy2) {
                        str = `${item.zdy1} ${item.opt1} ${value} && ${value} ${item.opt2} ${item.zdy2}`;
                    }
                    return eval(str);
                }
            })
        },


    },
}

</script>
<style>
@import "../../css/workflow.css";
.error-modal-list {
    width: 455px;
}
</style>