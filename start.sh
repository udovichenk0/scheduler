#!/bin/sh

docker image rm $(docker images -q)
