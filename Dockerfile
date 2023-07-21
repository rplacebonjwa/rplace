FROM alpine:3.18.2

RUN apk update && apk upgrade; \
apk add py3; \
apk add py3-pip; \
pip install toml; \
pip install pillow;
