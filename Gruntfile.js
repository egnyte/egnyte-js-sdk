module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ["dist"],
        browserify: {
            dist: {
                files: {
                    "dist/egnyte.js": ["src/egnyte.js"],
                    "dist/slim.js": ["src/slim.js"]
                },
                options: {
                    transform: [
                        'grunt-less-browserify'
                    ],
                    bundleOptions: {
                        fullPaths: false,
                        insertGlobals: false,
                        detectGlobals: false
                        //,standalone: "Egnyte"
                    }
                }
            }
        },
        unpathify: {
            files: ["dist/egnyte.js", "dist/slim.js"]
        },
        uglify: {
            options: {
                report: 'gzip',
                banner: "// <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>) \n" +
                    "// license:<%= pkg.license %> \n" +
                    "// <%= pkg.author %> \n"
            },
            dist: {
                files: [{
                    src: 'dist/*.js', // source files mask
                    dest: 'dist/', // destination folder
                    expand: true, // allow dynamic building
                    flatten: true, // remove all unnecessary nesting
                    ext: '.min.js' // replace .js to .min.js
                }]
            }
        },

        copy: {
            resources: {
                cwd: 'src/resources',
                src: '*',
                dest: 'dist/resources',
                expand: true
            }
        },

        jasmine: {
            all: {
                src: ["dist/egnyte.js", "spec/conf/apiaccess.js", "src/vendor/zenjungle.js"],
                options: {
                    junit:{
                        path: ".",
                        consolidate:true,
                    },
                    keepRunner: true,
                    helpers: ["spec/helpers/*.js"],
                    specs: 'spec/*.js',
                    '--web-security': false,
                    '--local-to-remote-url-access': true,
                    '--ignore-ssl-errors': true
                }
            }
        },
        nodeunit: {
            all: ['src/unittests/*.js']
        },
        connect: {
            server: {
                options: {
                    port: 9999,
                    hostname: "0.0.0.0",
                    base: ".",
                    protocol: "https",
                    keepalive: true
                }
            },
            corsmock: {
                options: {
                    port: 9991,
                    hostname: "0.0.0.0",
                    base: "mock/",
                    protocol: "https",
                    keepalive: true,
                    middleware: function (connect, options, middlewares) {
                        // inject a custom middleware 
                        middlewares.unshift(function (req, res, next) {
                            console.log(JSON.stringify(req.headers));
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', '*');
                            return next();
                        });

                        return middlewares;
                    }
                }
            }

        },

        watch: {
            files: ["src/**/*"],
            tasks: ["dist", "markdown:docs"]
        },

        markdown: {
            docs: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/docs/*.md',
                        dest: 'docs/',
                        ext: '.html'
                    }
                ],
                options: {
                    template: 'src/docs/template.html'
                }
            }
        }
    })
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('unpathify');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-markdown');


    grunt.registerTask("test", ["nodeunit", "dist", "jasmine:all"]);
    grunt.registerTask("dist", ["clean", "markdown", "copy", "browserify", "unpathify", "uglify"]);
    grunt.registerTask("build", ["dist"]);
    grunt.registerTask("serve", ["dist", "connect:server"]);

    grunt.registerTask("default", ["test"]);
}