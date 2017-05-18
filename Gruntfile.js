module.exports = function (grunt) {
    var package = grunt.file.readJSON("package.json");
    var versionNoMinor = package.version.replace(/\.[0-9]+$/, '');
    grunt.initConfig({
        pkg: package,
        clean: ["dist"],
        browserify: {
            dist: {
                files: {
                    "dist/egnyte.js": ["src/egnyte.js"],
                    "dist/slim.js": ["src/slim.js"],
                    "dist/uintegrate.js": ["src/plugins/UIntegrate/uintegrateStandalone.js"],
                },
                options: {
                    transform: ['node-lessify'],
                    plugin: ['bundle-collapser/plugin'],
                    browserifyOptions: {
                        fullPaths: false,
                        insertGlobals: false,
                        detectGlobals: false,
                        standalone: "Egnyte"
                    }
                }
            }
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
            },
            ieProxy: { //forwarder folder is not cleaned to retain older versions
                files: [
                    {
                        cwd: 'src/lib/api_forwarder',
                        src: 'apiForwarder.html',
                        dest: 'forwarder/' + versionNoMinor,
                        expand: true
                    },
                    {
                        cwd: 'dist',
                        src: 'slim*',
                        dest: 'forwarder/' + versionNoMinor,
                        expand: true
                    }
                ]
            }
        },
        dependo: {
            main: {
                options: {
                    fileName: 'dependencyGraph.html'
                }
            },
            filtered: {
                options: {
                    fileName: 'dependencyGraphFiltered.html',
                    exclude: 'reusables|q/q'
                }
            },
            options: {
                outputPath: './docs/',
                targetPath: './src',
                fileName: 'dependencyGraph.html',
                format: 'cjs'
            }
        },

        jasmine: {
            all: {
                src: ["dist/egnyte.js", "spec/conf/apiaccess.js", "src/vendor/zenjungle.js"],
                options: {
                    junit: {
                        path: ".",
                        consolidate: true,
                    },
                    keepRunner: true,
                    helpers: ["spec/helpers/*.js"],
                    specs: 'spec/*.spec.js',
                    // '--web-security': false,
                    '--local-to-remote-url-access': true,
                    '--ignore-ssl-errors': true
                }
            }
        },
        jasmine_nodejs: {
            options: {
                stopOnFailure: false,
                specNameSuffix: 'spec.js',
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: true,
                        verbose: true
                    }
                }
            },
            all: {
                specs: ['spec/*' + (grunt.option("filter") ? grunt.option("filter") + "*" : '')]
            }
        },
        nodeunit: {
            units: ['src/unittests/*.js']
        },
        connect: {
            server: {
                options: {
                    port: 9999,
                    hostname: "0.0.0.0",
                    base: ".",
                    protocol: "https",
                    keepalive: true,
                    middleware: function (connect, options, middlewares) {
                        // inject a custom middleware
                        middlewares.unshift(function (req, res, next) {
                            if (req.url.match(/mock/)) {
                                setTimeout(next, 1000);
                            } else {
                                return next();
                            }
                        });

                        return middlewares;
                    }
                }
            },
            realAPI: {
                options: {
                    port: 9991,
                    hostname: "0.0.0.0",
                    base: "forwarder",
                    protocol: "https",
                    keepalive: true,
                    middleware: function (connect, options) {
                        var proxy = require("grunt-connect-proxy/lib/utils").proxyRequest;
                        return [
                        connect.static(options.base[0]),
                        function (req, res, next) {
                                //                                req.headers["X-Egnyte-Subdomain"] = "subdomain0.egnyte.com";
                                //                                req.headers["host"] = "subdomain0.egnyte.com";
                                console.log(req.headers, req.url);
                                next();
                        },
                        proxy
                    ];
                    }
                },

                proxies: [
                    {
                        context: "/",
                        host: grunt.option("host") || "zb.qa-egnyte.com",
                        port: 443,
                        https: true,
                        changeOrigin: true,
                        xforward: false
                    }
                ]

            }

        },

        watch: {
            files: ["src/**/*"],
            tasks: ["browserify"]
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
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-dependo');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');


    grunt.registerTask("test-browser", ["nodeunit:units", "build", "jasmine:all"]);
    grunt.registerTask("test-node", ["jasmine_nodejs:all"]);
    grunt.registerTask("test", ["test-browser", "test-node"]);
    grunt.registerTask("build", ["clean", "browserify", "uglify", "copy"]);
    grunt.registerTask("dist", ["build", "markdown", "dependo"]);
    grunt.registerTask("serve", ["build", "connect:server"]);
    grunt.registerTask("serve:API", ["serve:api"]);
    grunt.registerTask("serve:api", ["build", "configureProxies:realAPI", "connect:realAPI"]);

    grunt.registerTask("default", ["test"]);
}
