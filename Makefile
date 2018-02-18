all:
	middleman build


init:
	bundle install --binstubs


server:
	middleman server

deploy: all
	rsync -avz --delete build/ ${TARGET}
