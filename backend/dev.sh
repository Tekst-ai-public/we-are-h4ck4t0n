#!/bin/bash

if [ "$NO_HOT_RELOAD" = "true" ]; then
	echo "NO_HOT_RELOAD is set to true, starting server."
	npm run startprod
	# Put your code here for the scenario when NO_HOT_RELOAD is true
else

	echo "Starting dev server..."

	# Install global dependencies if they are not installed
	npm install -g @swc/cli@0.1.64 --no-progress --no-audit --no-fund --loglevel=silent
	npm install -g @swc/core@1.3.105 --no-progress --no-audit --no-fund --loglevel=silent
	npm install -g nodemon --no-progress --no-audit --no-fund --loglevel=silent

	# Build the project using swc and start the app
	swc src --out-dir dist
	node dist/app.js &
	echo $! >.pidfile

	# Start nodemon to watch the src directory and rebuild and rerun the app on changes
	nodemon --watch src --ext js,ts,json --ignore dist/ --exec "bash -c 'swc src --out-dir dist && (kill \$(cat .pidfile) 2>/dev/null || true); node dist/app.js & echo \$! > .pidfile'"
fi
