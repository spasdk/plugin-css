/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs = require('fs'),
    PluginTemplate = require('spa-plugin');


/**
 * @constructor
 * @extends PluginTemplate
 *
 * @param {Object} config init parameters (all inherited from the parent)
 */
function Plugin ( config ) {
    var self = this;

    // parent constructor call
    PluginTemplate.call(this, config);

    // create tasks for profiles
    this.profiles.forEach(function ( profile ) {
        // main entry task
        var taskName = profile.task(self.entry, function ( done ) {
                var data = '';
                /*self.build(profile, function ( error ) {
                    var message;

                    if ( error ) {
                        // prepare
                        message = error.message.split('\n');

                        profile.notify({
                            type: 'fail',
                            info: error.message,
                            title: self.entry,
                            message: [message[0].trim(), '', message[message.length - 1].trim()]
                        });
                    } else {
                        profile.notify({
                            info: 'write ' + profile.data.target,
                            tags: [self.entry],
                            title: self.entry
                            //message: profile.data.target
                        });
                    }

                    done();
                });*/

                profile.data.source.forEach(function ( file ) {
                    try {
                        data = data.concat(fs.readFileSync(file)) + '\n';
                    } catch ( error ) {
                        console.log(error);
                        profile.notify({
                            info: 'read ' + file,
                            type: 'warn',
                            tags: [self.entry],
                            data: error.message
                        });
                    }
                });

                //console.log(profile.data.target);
                fs.writeFileSync(profile.data.target, data);

                profile.notify({
                    info: 'write ' + profile.data.target,
                    tags: [self.entry]
                    //title: self.entry
                    //message: profile.data.target
                });

                // todo: add minimization for release

                done();
            }),
            watcher;

        // rebuild on files change
        profile.task('watch', function ( done ) {
            watcher = self.watch(profile.data.watch, taskName);
            watcher.done = done;
        });

        // stop watching
        profile.task('unwatch', function () {
            if ( watcher ) {
                // finish chokidar
                watcher.close();
                // complete the initial task
                watcher.done();
                // clear
                watcher = null;
            }
        });

        // remove the generated file
        profile.task('clean', function ( done ) {
            fs.unlink(profile.data.target, function ( error ) {
                var msg = {
                    info: 'delete ' + profile.data.target,
                    tags: ['clean']
                };

                if ( error ) {
                    msg.type = 'warn';
                    msg.data = error;
                }

                profile.notify(msg);

                done();
            });
        });
    });

    this.debug('tasks: ' + Object.keys(this.tasks).sort().join(', '));
}


// inheritance
Plugin.prototype = Object.create(PluginTemplate.prototype);
Plugin.prototype.constructor = Plugin;


// generate output file from profile
/*Plugin.prototype.build = function ( profile, callback ) {
    var data = profile.data,
        render;

    try {
        // prepare function
        render = jade.compileFile(data.source, {
            filename: data.source,
            pretty: data.indentString
        });

        // save generated result
        fs.writeFileSync(data.target, render(data.variables));

        callback(null);
    } catch ( error ) {
        callback(error);
    }
};*/


// public
module.exports = Plugin;
