const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})


module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:8000/',
				changeOrigin: true,
				ws: true,
				secure: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
};
