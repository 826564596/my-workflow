module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
    outputDir: "dist",

    pages: {
        index: {
            //entry for the page
            entry: "src/main.js",
            //the source template
            template: "public/index.html",
            //output as dist/index.html
            filename: "index.html"
        }
    },
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 8083,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
        proxy: null, // string | Object
        before: app => {}
    },

    css: {
        loaderOptions: {
            css: {},
            postcss: {
                plugins: [
                    require("postcss-px2rem")({
                        remUnit: 37.5
                    })
                ]
            }
        }
    }
};
