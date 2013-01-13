# You can watch the results as they are written to the Readme.md
doc:
	@cat docs/head.md > Readme.md
	@npm ls | sed s/promise-perf-test\.*// >> Readme.md
	@cat docs/middle.md >> Readme.md
	@pperf | ./node_modules/.bin/stripcolorcodes >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: doc