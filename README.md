<p align="center"><a href="https://ibb.co/L5sCbLC"><img width=25% src="https://i.ibb.co/3zP0GD0/687474703a2f2f6936332e74696e797069632e636f6d2f333031336c67342e706e67.png" alt="687474703a2f2f6936332e74696e797069632e636f6d2f333031336c67342e706e67" border="0" /></a></p>
<p align="center"><a href="https://ibb.co/CbnHXKC"><img width=45% src="https://i.ibb.co/T4HgnMj/linkedpipes-logo.png" alt="linkedpipes-logo" border="0" /></a></p>

<p align="center">
    <a href="https://travis-ci.org/linkedpipes/applications"><img src="https://travis-ci.org/linkedpipes/applications.svg?branch=develop" alt="Travis status" /></a>
    <a href="https://app.codacy.com/app/LinkedPipes/applications?utm_source=github.com&utm_medium=referral&utm_content=linkedpipes/applications&utm_campaign=Badge_Grade_Settings"><img src="https://api.codacy.com/project/badge/Grade/87ac72b5a8d347b5a10a519323d71b6f" alt="Codacy" /></a>
    <a href="https://renovatebot.com/"><img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="Renovate Bot" /></a>
    <a href="https://linkedpipes.docs.apiary.io"><img src="https://img.shields.io/badge/Documentation-Apiary-Blue.svg" alt="Apiary" /></a>
</p>

## About

LinkedPipes Applications is a visualization web platform that allows the users to explore, visualize and publish LinkedData based visualizer applications. Applications created with these platforms can be easily published and integrated anywhere on the Web!

## Quick start

The whole app can be run using [docker compose](https://docs.docker.com/compose/install/):

The production version can be run with:

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/master/docker-compose-master.yml -o docker-compose.yml &&
curl https://raw.githubusercontent.com/linkedpipes/applications/master/nginx-prod.conf -o nginx-prod.conf && docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up
```

The development version can be run with:

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/master/docker-compose.yml -o docker-compose.yml &&
curl https://raw.githubusercontent.com/linkedpipes/applications/master/nginx.conf -o nginx.conf && docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up
```

If it fails it can be because you already have some container with the same names running. You can delete these containers with the
following command:s

```bash
 $ docker rm $(docker ps -a -q -f name=lpa-*)
```

## Manual start

You can also run the whole application by directly from the code in the repository.

First download the whole repository into your computer by running

```bash
$ git clone https://github.com/linkedpipes/applications.git lpa
```

Then set your working directory to the one that you just downloaded:

```bash
$ cd lpa
```

Finally, execute

```bash
(lpa)$ docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up --build
```

You should be able to access: <br/>
• **Frontend** of LPA at `localhost:9001` <br/>
• **Backend** of LPA at `localhost:9005` <br/>
• Local **Discovery** at `localhost:9000` <br/>
• Local **ETL** at `localhost:8080` <br/>
• Local **Virtuoso** at `localhost:8890`

You can also customize some settings in the following files:

- `docker-compose.yml` - for development builds
- `nginx.conf`
- `src/backend/src/main/config/com/linkedpipes/lpa/backend/config.properties`

---

## Testing

<p align="center"><img img width=35% src="https://i.ibb.co/MnhHHBq/Browserstack-logo-2x.png" alt="Browserstack-logo-2x" border="0"><br /></p>

LinkedPipes Applications uses [BrowserStack](https://www.browserstack.com) for automated integration testing.
