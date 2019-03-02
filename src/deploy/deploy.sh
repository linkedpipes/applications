cd /home/project

echo "Pulling from Master" 
if cd repo; then git pull origin master; else git clone https://github.com/linkedpipes/applications.git repo && cd repo; fi
echo "Pulled successfully from master"

echo "Restarting server..."
docker-compose -f docker-compose-master.yml down || true
docker container prune --force || true
docker network prune --force || true

echo "Pulling latest images..."
docker-compose -f docker-compose-master.yml pull

echo "Starting containers again"
docker-compose -f docker-compose-master.yml up -d --force-recreate

echo "Server restarted Successfully"

exit
