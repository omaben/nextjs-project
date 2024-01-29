#!/bin/bash




registry="cralienstage"

image_name="alien-backoffice-web"

branch=$(git rev-parse --abbrev-ref HEAD)

image_tag=$branch

docker build --pull --rm -f "Dockerfile" -t $image_name:$image_tag "."

az acr login --name $registry

docker tag $image_name:$image_tag $registry.azurecr.io/$image_name:$image_tag

docker push $registry.azurecr.io/$image_name:$image_tag