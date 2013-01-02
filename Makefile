run:
	@node lib/run-all.js

doc:
	@cat docs/head.md > Readme.md
	@node lib/run.js >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: run doc