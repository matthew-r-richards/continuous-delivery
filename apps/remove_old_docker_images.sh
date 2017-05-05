#!/bin/bash
# remove containers
CONTAINERS=$(docker ps -q -a)
if [ "$CONTAINERS" ]
then
    docker stop $CONTAINERS &> /dev/null
    docker rm $CONTAINERS &> /dev/null
fi

# remove images
IMAGES_TO_DELETE=( "server-app" "client-app" )
for IMAGE in "${IMAGES_TO_DELETE[@]}"
do
    DOCKER_IMAGE=$(docker images $IMAGE -q)
    if [ "$DOCKER_IMAGE" ]
    then
        docker rmi $DOCKER_IMAGE
    fi
done