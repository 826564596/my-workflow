/* eslint-disable prettier/prettier */
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
                    <div class="ghost-bar" style="transform: translateX(300px);"></div>
                    <div class="fd-nav-item"><span class="order-num">1</span>基础设置</div>
                    <div class="fd-nav-item"><span class="order-num">2</span>表单设计</div>
                    <div class="fd-nav-item active"><span class="order-num">3</span>流程设计</div>
                    <div class="fd-nav-item"><span class="order-num">4</span>高级设置</div>
                </div>
            </div>
            <div class="fd-nav-right">
                <button type="button" class="ant-btn button-preview"><span>预 览</span></button>
                <button type="button" class="ant-btn button-publish" @click="saveSet">
                    <span>发 布</span>
                </button>
            </div>
        </div>
        <!-- 主体 -->
        <div class="fd-nav-content">
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
            formData: [] //表单数据
        };
    },
    created() {
        this.$axios
            .get("/data.json", {
                // .get("/newData.json", {
                workFlowDefId: this.$route.params.workFlowDefId
            })
            .then(res => {
                this.processConfig = res.data;
                this.nodeConfig = this.processConfig.nodeConfig;
                this.flowPermission = this.processConfig.flowPermission;
                this.directorMaxLevel = this.processConfig.directorMaxLevel;
                this.workFlowDef = this.processConfig.workFlowDef;
                this.tableId = this.processConfig.tableId;
                this.formData = this.processConfig.formData;
                // console.log(this.nodeConfig);
            });
    },
    methods: {
        toReturn() {
            //window.location.href = ""
        },
        //递归遍历nodeConfig
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
                    if (data.childNode.error) {
                        this.tipList.push({
                            name: data.childNode.nodeName,
                            type: "抄送人"
                        });
                    }
                    this.reErr(data.childNode);
                } else if (data.childNode.type == 3) {
                    this.reErr(data.childNode.childNode);
                } else if (data.childNode.type == 4) {
                    this.reErr(data.childNode);
                    for (
                        var i = 0;
                        i < data.childNode.conditionNodes.length;
                        i++
                    ) {
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
            this.processConfig.flowPermission = this.flowPermission;
            console.log(JSON.stringify(this.processConfig));
            // this.$axios.post("", this.processConfig).then(res => {
            //     console.log(res);
            //     if (res.code == 200) {
            //         this.$message.success("设置成功");
            //         setTimeout(function () {
            //             window.location.href = ""
            //         }, 200)
            //     }
            // })
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
        }
    }
};
</script>
<style>
@import "../../css/workflow.css";
.error-modal-list {
    width: 455px;
}
</style>