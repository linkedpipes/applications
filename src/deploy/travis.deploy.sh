docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker-compose -f docker-compose-travis-deploy.yml build --parallel
docker push linkedpipes/applications:frontend-prod
docker push linkedpipes/applications:frontend
docker push linkedpipes/applications:frontend-backend