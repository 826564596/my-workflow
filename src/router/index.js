import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/approval/setting",
    },
    {
        path: "/approval/setting",
        name: "approval",
        component: (resolve) => {
            require([`@/views/approval/setting`], resolve);
        },
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
