#!/bin/sh

cd /home/ec2-user/hellonode
nohup node server.js > output.log &
