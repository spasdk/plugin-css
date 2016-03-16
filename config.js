/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path     = require('path'),
    extend   = require('extend'),
    config   = require('spa-plugin/config'),
    pkgData  = require(path.join(process.cwd(), 'package.json')),
    profiles = {},
    modules  = ['spa-app', 'spa-component'];


function preparePaths ( name ) {
    var paths = modules.map(function ( moduleName ) {
        return path.join(path.dirname(require.resolve(moduleName)), 'css', name + '.css');
    });

    paths.push(path.join(config.source, 'css', name + '.css'));

    return paths;
}


Object.keys(pkgData.dependencies || {}).concat(Object.keys(pkgData.devDependencies || {})).forEach(function ( name ) {
    if ( name.indexOf('spa-component-') === 0 ) {
        modules.push(name);
    }
});


// main
profiles.release = extend(true, {}, config, {
    // main entry point
    source: preparePaths('release'),

    // intended output file
    target: path.join(config.target, 'css', 'release.css'),

    // info channels
    notifications: {
        popup: {
            info: {icon: path.join(__dirname, 'media', 'info.png')},
            warn: {icon: path.join(__dirname, 'media', 'warn.png')},
            fail: {icon: path.join(__dirname, 'media', 'fail.png')}
        }
    }
});

// array of globs to monitor
//profiles.release.watch = profiles.release.source;
profiles.release.watch = path.join(config.source, 'css', '**', 'release*');


profiles.develop = extend(true, {}, profiles.release, {
    // main entry point
    source: preparePaths('develop'),

    // intended output file
    target: path.join(config.target, 'css', 'develop.css')
});

// array of globs to monitor
//profiles.develop.watch = profiles.develop.source;
profiles.develop.watch = path.join(config.source, 'css', '**', 'develop*');

// public
module.exports = profiles;
