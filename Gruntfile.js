module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		builddir: '.',
		meta: {
			banner: '/**\n' +
						' * <%= pkg.description %>\n' +
						' * @version v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						' * @link <%= pkg.homepage %>\n' +
						' * @license <%= pkg.license %>' + ' */'
		},
		swatch: {
			amelia:{}, cerulean:{}, cosmo:{}, cyborg:{}, flatly:{}, journal:{},
			readable:{}, simplex:{}, slate:{}, spacelab:{}, united:{}, colibri:{},
			custom:{}
		},
		clean: {
			build: {
				src: ['*/build.less', '!global/build.less']
			}
		},
		concat: {
			dist: {
				src: [],
				dest: ''
			}
		},
		recess: {
			dist: {
				options: {
					compile: true,
					compress: false
				},
				files: {}
			}
		},
		less: {
		  development: {
		    options: {},
		    files: {}
		  },
		  production: {
		    options: {
		      yuicompress: true
		    },
		    files: {}
		  }
		}
	});

	grunt.registerTask('none', function() {});

	grunt.registerTask('build', 'build a regular theme', function(theme, compress) {
		var compress = compress == undefined ? true : compress;

		var concatSrc;
		var concatDest;
		var recessDest;
		var recessSrc;
		var files = {};
		var dist = {};
		concatSrc = 'global/build.less';
		concatDest = theme + '/build.less';
		recessDest = '<%=builddir%>/' + theme + '/bootstrap.css';
		recessSrc = [ theme + '/' + 'build.less' ];

		dist = {src: concatSrc, dest: concatDest};
		grunt.config('concat.dist', dist);
		files = {}; files[recessDest] = recessSrc;
		grunt.config('recess.dist.files', files);
		grunt.config('recess.dist.options.compress', false);

		grunt.task.run(['concat', 'recess:dist', 'clean:build',
			compress ? 'compress:'+recessDest+':'+'<%=builddir%>/' + theme + '/bootstrap.min.css':'none']);
	});

	grunt.registerTask('build-less', 'build a regular theme', function(theme, compress) {
		var compress = compress == undefined ? true : compress;

		var concatSrc;
		var concatDest;
		var recessDest;
		var recessSrc;
		var files = {};
		var dist = {};
		concatSrc = 'global/build.less';
		concatDest = theme + '/build.less';
		recessDest = '<%=builddir%>/' + theme + '/bootstrap.css';
		recessSrc = [ theme + '/' + 'build.less' ];

		dist = {src: concatSrc, dest: concatDest};
		grunt.config('concat.dist', dist);
		files = {}; files[recessDest] = recessSrc;
		grunt.config('less.development.files', files);

		grunt.task.run(['concat', 
			'less:development', 
			'clean:build',
			compress ? 'compress-less:'+recessDest+':'+'<%=builddir%>/' + theme + '/bootstrap.min.css':'none']);
	});

	grunt.registerTask('compress', 'compress a generic css', function(fileSrc, fileDst) {
		var files = {}; files[fileDst] = fileSrc;
		grunt.log.writeln('compressing file ' + fileSrc);

		grunt.config('recess.dist.files', files);
		grunt.config('recess.dist.options.compress', true);
		grunt.task.run(['recess:dist']);

	});

	grunt.registerTask('compress-less', 'compress a generic css', function(fileSrc, fileDst) {
		var files = {}; files[fileDst] = fileSrc;
		grunt.log.writeln('compressing file ' + fileSrc);

		grunt.config('less.production.files', files);
		grunt.task.run(['less:production']);
	});

	grunt.registerMultiTask('swatch', 'build a theme', function() {
		var t = this.target;
		//grunt.task.run('build:'+t);
		grunt.task.run('build-less:'+t);
	});
	
	grunt.registerTask('default', 'build a theme', function() {
		grunt.task.run('swatch');
	});
};