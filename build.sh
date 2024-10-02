#! /bin/bash

set -xe
ACCOUNT=175430651998
REPO=3ds-sdk-server
aws ecr get-login-password --region us-east-2 --profile test | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.us-east-2.amazonaws.com/$REPO.dkr.ecr.us-east-2.amazonaws.com

docker build --no-cache . -t $ACCOUNT.dkr.ecr.us-east-2.amazonaws.com/$REPO
docker push $ACCOUNT.dkr.ecr.us-east-2.amazonaws.com/$REPO
