const path = require('path')
const isProduction = process.env.NODE_ENV === 'production';
const devNeedCdn = false; //开发环境是否使用CDN
const cdn = {
	externals: {
		"vue": 'Vue',
		"vuex": 'Vuex',
		'vue-router': 'VueRouter',
		'axios': 'axios',
		'element-ui': 'ELEMENT',
		'echarts': 'echarts'
	},
	css: [
		"https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css"
	],
	js: [
		'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
		'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
		'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
		'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
		'https://cdn.bootcss.com/echarts/4.4.0-rc.1/echarts.min.js',
		'https://unpkg.com/element-ui/lib/index.js'
	]
}
module.exports = {
	publicPath: '/',
	outputDir: 'dist',
	filenameHashing: true, // 是否为文件添加hash值，便于清楚缓存
	productionSourceMap: false, // 生产环境是否使用 source map
	configureWebpack: config => {
		if (isProduction || devNeedCdn) {
			config.externals  = cdn.externals;
			//config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true//生产环境去除console  生产环境启用csn需要注释掉这段  开发环境minimizer为nudefined
		} else {
			console.log('当前环境开发环境')
		}

	},
	chainWebpack: config => {
		config.plugin('prefetch').tap(options => {  //移除预加载模块
			options[0].fileBlacklist = options[0].fileBlacklist || []
			options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
			return options
		});
		config.plugin('html').tap(args => {
			// 生产环境或本地需要cdn时，才注入cdn
			if (isProduction || devNeedCdn) args[0].cdn = cdn
			return args
		});
		config.module
			.rule('images')
			.use('url-loader')
			.loader('url-loader')
			.tap(options => Object.assign(options, { limit: 20000 }))
	},
	devServer: {
		port: '',
		https: false,
		host: '0.0.0.0',
		overlay: {
			warnings: true,
			errors: true
		},
		// proxy: {
			
		// }
	}

}
