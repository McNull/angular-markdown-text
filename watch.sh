#!/bin/sh

# At the moment of writing gulp doesn't handle thrown exceptions very well when watching for file modifications.
# This ensures the watch is up and running.

# https://github.com/gulpjs/gulp/issues/216

until gulp modules-watch
 do growlnotify -name gulp -m "gulp watch restarted"
 sleep 1
done