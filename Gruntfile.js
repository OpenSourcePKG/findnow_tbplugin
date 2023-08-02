
module.exports = (grunt) => {
    const srcDir = "src/";
    const outDir = "built/";
    const outDirExtracted = "dist/";
    const outXpi = outDir + "/Findnow.xpi";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        //clean: [outDir],
        compress: {
            main: {
                options: {
                    archive: outXpi,
                    mode: "zip",
                },
                files: [
                    {
                        expand: true,
                        cwd: outDirExtracted,
                        src: ["**"],
                        dest: "/"
                    }, // makes all src relative to cwd
                ],
            },
        },
    });

    grunt.loadNpmTasks("grunt-contrib-compress");

    grunt.registerTask("default", ["compress"]);
};