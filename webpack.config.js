const path = require("path");

module.exports = {
    entry: {
        popup: "./popup.ts", // Use this for browser action or page action extensions
        background: "./background.ts", // Use this for background script extensions
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    devtool: "source-map",
    watch: true,
};
