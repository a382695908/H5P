module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			background: {
				src: ['src/background/base/canvas.js',
					  'src/background/base/adapter.js',
					  'src/background/base/color.js',
					  'src/background/base/imageLoad.js',
					  'src/background/base/layer.js',
					  'src/background/base/map.js',
					  'src/background/base/point.js',
					  'src/background/base/process.js',
					  'src/background/base/reload.js',
					  'src/background/base/size.js',
					  'src/background/base/worker.js',
					  'src/background/base/queue.js',
					  'src/background/base/border.js',
					  'src/background/base/rotate.js',
					  'src/background/form/core.js',
					  'src/background/form/main.js',
					  'src/background/form/process.js',
					  'src/background/chrome/speciallyConfig.js',
					  'src/background/chrome/app.js'
				],
				dest: 'bulid/background.js'
			},
			// main js 合并
			main: {
				src: ['src/require/config.js',
					  'src/main/data.js',
					  'src/main/init.js',
					  'src/main/resize.js',
					  'src/main/balance.js',
					  'src/main/base.js',
					  'src/main/nav.js',
					  'src/main/specially.js',
					  'src/main/tool.js',
					  'src/main/open.js',
					  'src/main/push.js',
					  'src/main/refresh.js',
					  'src/main/current.js',
					  'src/main/blur.js',
					  'src/main/gray.js',
					  'src/main/mosaic.js',
					  'src/main/change.js',
					  'src/main/seal.js',
					  'src/main/border/jiandan.js',
					  'src/main/border/wenli.js',
					  'src/main/border/xuancai.js',
					  'src/main/rotate.js',
					  'src/main/changeSize.js',
					  'src/main/cut.js',
					  'src/main/bg.js',
					  'src/main/pencil.js'
				],
				dest: 'bulid/main.js'
			},
			process_state: {
				src: ['src/process/state/header.js',
					  'src/process/state/pen.js',
					  'src/process/state/file.js',
					  'src/process/state/image.js',
					  'src/process/state/medio.js',
					  'src/process/state/part.js',
					  'src/process/state/change.js',
					  'src/process/state/seal.js',
					  'src/process/state/cut.js',
					  'src/process/state/pencil.js',
					  'src/process/state/footer.js'
				],
				dest: 'src/process/state.js',
			},
			// process js 合并
			process: {
				src: ['src/process/data.js',
					  'src/process/medio.js',
					  'src/process/openFile.js',
					  'src/process/update.js',
					  'src/process/draw.js',
					  'src/process/drawPart.js',
					  'src/process/state.js',
					  'src/process/init.js'
					  // 'src/process/fullScreen.js'
				],
				dest: 'bulid/process.js'
			},
			// css 合并
			css: {
				src: ['src/css/reset.css',
					  'src/css/layout.css',
					  'src/css/main.css',
					  'src/css/process.css'
				],
				dest: 'bulid/style.css'
			}
		},
		// js 压缩
		uglify: {
			options: {
				banner: '/* \n'+
					    ' * name: <%= pkg.name %> \n' +
						' * build time: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> \n' +
						' */\n'
			},
			min: {
				files: {
					'../background.js': 'bulid/background.js',
					'../js/main.min.js': 'bulid/main.js',
					'../js/process.min.js': 'bulid/process.js'
				}
			}
		},
		// css 压缩
		cssmin: {
			options: {
				banner: '/* \n'+
					    ' * name: <%= pkg.name %> \n' +
						' * build time: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> \n' +
						' */\n'
			},
			css: {
				files: {
					'../css/index.min.css': 'bulid/style.css'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};