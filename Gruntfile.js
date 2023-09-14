const webpackConfig = require('./webpack.config.js');

module.exports = (grunt) => {
    const outDir = 'built/';
    const outDirExtracted = 'dist/';
    const outXpi = `${outDir}/Findnow.xpi`;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('assets/manifest.json'),
        clean: {
            initial: [outDir],
            dist: [`${outDirExtracted}/*`]
        },
        exec: {
            tsc: '"npm run tsc'
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/',
                        src: ['**/*'],
                        dest: outDirExtracted
                    }
                ]
            }
        },
        webpack: {
            dev: webpackConfig,
            release: webpackConfig.map((config) => Object.assign({}, config, {
                mode: 'production'
            }))
        },
        compress: {
            main: {
                options: {
                    archive: outXpi,
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: outDirExtracted,
                        src: ['**'],
                        dest: '/'
                    }
                    // makes all src relative to cwd
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('default', [
        // 'clean:initial',
        'clean:dist',
        'copy',
        'webpack:release',
        'compress'
    ]);

    grunt.registerTask('release', [
        // 'clean:initial',
        'clean:dist',
        'copy',
        'webpack:release',
        'compress'
    ]);
};