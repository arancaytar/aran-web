all:
	middleman build
	find build/blog -type f |xargs sed -i 's/href="\(\/.*\)\.html"/href="\1"/g'


init:
	bundle install --path=vendor --binstubs


server:
	middleman server

deploy: all
	rsync -avz --delete build/ ${TARGET}

clean:
	rm -rf vendor build bin .bundle .cache
