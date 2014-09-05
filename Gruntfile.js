module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				// the files to concatenate
				src: ['src/**/*.js'],
				// the location of the resulting JS file
				dest: 'dist/<%= pkg.name %>.js'
			}
		},

		uglify: {
			options: {
				// the banner is inserted at the top of the output
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
			  		'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},

		copy: {
      		css: {
		        expand: true,
		        cwd: 'css/',
		        src: '**/**',
		        dest: 'build/'
		    },
	    	html: {
	        	expand: true,
	        	cwd: 'html/',
	        	src: '**/**',
	        	dest: 'build/'
	    	},
	    	static: {
	        	expand: true,
	        	cwd: 'static/',
	        	src: '**/**',
	        	dest: 'build/'
	    	}
	    },

		qunit: {
			files: ['test/**/*.html']
		},

        clean: {
          build: {
            src: ["build/**/**"]
          },
          dist: {
            src: ["dist/**/**"]
          },
        },

		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
				options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},

		sass: {
          dev: {
            options: {
              style: 'nested',
              trace: true
            },
            files: [{
              expand: true,
              cwd: 'scss/',
              src: ['application.scss'],
              dest: 'css/',
              ext: '.css'
            }]
          },
          prod: {
            options: {
              style: 'compressed',
              noCache: true
            },
            files: [{
              expand: true,
              cwd: 'static/scss/',
              src: ['application.scss'],
              dest: 'static/css/',
              ext: '.css'
            }]
          }
        },
		
		watch: {
			scss: {
	            files: ['scss/**/*.scss'],
	            tasks: ['sass:dev'],
	            options: {
	              spawn: false
	            }
			},
			css: {
				files: ['css/**/*.css', 'html/**/*.html'],
				tasks: ['copy'],
				options: {
					spawn: false
				}
			},
			files: ['<%= jshint.files %>'],
			tasks: ['jshint'],
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

    /** Run unit tests only **/
	grunt.registerTask('test', [
		'jshint', 
		'qunit'
	]);

	/** Create build directory to work from **/
	grunt.registerTask('build', [
		'copy',
    ]);

	/** Create distribution to upload/etc **/
	grunt.registerTask('dist', [
		'default',
		'copy:dist',
        'sass:prod',
    ]);

	/** Default task - checks js, runs tests, etc **/
	grunt.registerTask('default', [
		'jshint', 
		// 'qunit', 
		'concat', 
		'uglify'
	]);
};
