all:
	middleman build


init:
	bundle install --path=vendor --binstubs


server:
	middleman server

deploy: all
	rsync -avz --delete build/ ${TARGET}
