/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    "files": ["dist/**/*.{css,js}"],
    "watchOptions": {
        ignoreInitial: true,
        ignored: '*.txt'
    },
    "server": {
        baseDir: "dist",
        index: "index.html"
    },
    "serveStatic": [],
    "ghostMode": false,
    "open": false,
    "browser": "default",
    "xip": false,
    "hostnameSuffix": false,
    "reloadOnRestart": true,
    "notify": true,
    "injectChanges": true,
    "startPath": null,
    "minify": true,
    "tagNames": {
        "less": "link",
        "scss": "link",
        "css": "link",
        "jpg": "img",
        "jpeg": "img",
        "png": "img",
        "svg": "img",
        "gif": "img",
        "js": "script"
    }
};
