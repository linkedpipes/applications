#!/bin/bash

startDevelopment() {
  cd docker

  echo 'Attempting to stop current running configuration'
  docker-compose -f docker-compose.yml down

  echo 'Starting new compose configuration'
  docker-compose -f docker-compose.yml up --force-recreate
  cd ..
}

startDevelopmentPersistent() {
  cd docker

  echo 'Attempting to stop current compose configuration'
  docker-compose -f docker-compose-persistent.yml down

  echo 'Starting new compose configuration'
  docker-compose -f docker-compose-persistent.yml up --force-recreate
  cd ..
}

startProductionNoCloning() {

  mkdir -p lpa_temp/docker
  mkdir -p lpa_temp/nginx

  if [ -e "lpa_temp/docker/docker-compose.yml" ]; then
    echo 'docker-compose.yml already exists' >&2
  else
    curl https://raw.githubusercontent.com/linkedpipes/applications/master/docker/docker-compose-master.yml -o lpa_temp/docker/docker-compose.yml
  fi

  if [ -e "lpa_temp/docker/nginx-prod.conf" ]; then
    echo 'nginx-prod.conf already exists' >&2
  else
    curl https://raw.githubusercontent.com/linkedpipes/applications/master/nginx/nginx-prod.conf -o lpa_temp/nginx/nginx-prod.conf
  fi

  cd lpa_temp/docker

  echo 'Attempting to stop current compose configuration'
  docker-compose -f docker-compose.yml down

  echo 'Starting new compose configuration'
  docker-compose -f docker-compose.yml up
}


startProduction() {
  cd docker

  echo 'Attempting to stop current running configuration'
  docker-compose -f docker-compose-master.yml down

  echo 'Starting current running configuration'
  docker-compose -f docker-compose-master.yml up
  cd ..
}

cleanStorage() {
  cd docker
  rm -rf appData
  rm -rf data
  cd ..
  rm -rf appData
  rm -rf data
}

stopCompose() {
  docker-compose down
  cd docker
  docker-compose down
  cd ..
}

function usage {
    echo "usage: ./lpa-cli.sh [-dc]|[--detailed-command]"

    echo "-d   | --development                  Start non persistent development setup (assumes repository is already cloned)"
    echo "-dp  | --development-persistent       Start non persistend development setup (assumes repository is already cloned)"
    echo "-p   | --production                   Start persistend production setup (assumes repository is already cloned)"
    echo "-pnc | --production-no-cloning        Start persistend production setup (only use it if you don't want to clone the whole repository, don't execute this from within an already cloned repository)"
    echo "-cs  | --clean-storage                Remove 'appdata' and 'data' folders with database data and etc"
    echo "-sc  | --stop-compose                 Setup whatever configuration setup is currently running"
    echo "-h   | --help                         Print help documentation"

    exit 1
}


while [ ! $# -eq 0 ]
do
	case "$1" in
		--development | -d)
			startDevelopment
			exit
			;;
    --development-persistent | -dp)
			startDevelopmentPersistent
			exit
			;;
		--production-no-cloning | -pnc)
			startProductionNoCloning
			exit
			;;
    --production | -p)
			startProduction
			exit
			;;
    --clean-storage | -cs)
			cleanStorage
			exit
			;;
    --stop-compose | -sc)
			stopCompose
			exit
			;;
    --help | -h)
			usage
			exit
			;;

	esac
	shift
done
