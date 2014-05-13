module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ["dist"],
        browserify: {
            "dist/egnyte.js": ["src/egnyte.js"],
            "dist/slim.js": ["src/slim.js"]
        },
        uglify: {
            options: {
                banner: "// <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>) \n" +
                    "// license:<%= pkg.license %> \n" +
                    "// <%= pkg.author %> \n"
            },
            dist: {
                files: {
                    "dist/egnyte.min.js": ["dist/egnyte.js"],
                    "dist/slim.min.js": ["dist/slim.js"]
                }
            }
        },

        jasmine: {
            src: "dist/egnyte.js",
            options: {
                specs: 'spec/*.js'
            }
        },

        watch: {
            files: ["src/**/*.js"],
            tasks: ["dist"]
        }
    })
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jasmine');


    grunt.registerTask("test", ["dist", "jasmine"]);
    grunt.registerTask("dist", ["clean", "browserify", "uglify"]);

    grunt.registerTask("default", ["test"]);
}