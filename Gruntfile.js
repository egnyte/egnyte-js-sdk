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
                    "dist/slim.js": ["src/slim.js"]
                },
                options: {
                    transform: [
                        'node-lessify'
                    ],
                    browserifyOptions: {
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
                    '--web-security': false,
                    '--local-to-remote-url-access': true,
                    '--ignore-ssl-errors': true
                }
            }
        },
        jasmine_node: {
            options: {
                match: 'spec.js',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: ['spec/']
        },
        nodeunit: {
            units: ['src/unittests/*.js']
            //,integration: ['tests/*_test.js']
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
                    protocol: "http",
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
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-jasmine-node');


    grunt.registerTask("test-browser", ["nodeunit:units", "dist", "jasmine:all"]);
    grunt.registerTask("test-node", ["jasmine_node"]);
    grunt.registerTask("test", ["test","test-node"]);
    grunt.registerTask("dist", ["clean", "markdown", "browserify", "unpathify", "uglify", "copy"]);
    grunt.registerTask("build", ["dist"]);
    grunt.registerTask("serve", ["dist", "connect:server"]);
    grunt.registerTask("serve:API", ["serve:api"]);
    grunt.registerTask("serve:api", ["dist", "configureProxies:realAPI", "connect:realAPI"]);

    grunt.registerTask("default", ["test"]);
}