# You can watch the results as they are written to the Readme.md
Readme.md:
	@cat docs/head.md > Readme.md
	@npm ls | sed s/promise-perf-test\.*// >> Readme.md
	@cat docs/middle.md >> Readme.md
	@bin/cli.js | ./node_modules/.bin/stripcolorcodes >> Readme.md
	@cat docs/tail.md >> Readme.md
