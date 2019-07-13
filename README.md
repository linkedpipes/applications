<p align="center"><a  href="https://ibb.co/SvHTgZL"><img  width=25%  src="https://i.ibb.co/ysKTCx3/linkedpipes-logo.png"  alt="687474703a2f2f6936332e74696e797069632e636f6d2f333031336c67342e706e67"  border="0" /></a></p>
<p align="center"><a href="https://ibb.co/CbnHXKC"><img width=45% src="https://i.ibb.co/T4HgnMj/linkedpipes-logo.png" alt="linkedpipes-logo" border="0" /></a></p>

<p align="center">
    <a href="https://travis-ci.org/linkedpipes/applications"><img src="https://travis-ci.org/linkedpipes/applications.svg?branch=develop" alt="Travis status" /></a>
    <a href="https://app.codacy.com/app/LinkedPipes/applications?utm_source=github.com&utm_medium=referral&utm_content=linkedpipes/applications&utm_campaign=Badge_Grade_Settings"><img src="https://api.codacy.com/project/badge/Grade/87ac72b5a8d347b5a10a519323d71b6f" alt="Codacy" /></a>
    <a href="https://renovatebot.com/"><img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="Renovate Bot" /></a> </br>
    <a href="https://docs.applications.linkedpipes.com"><img src="https://img.shields.io/badge/Documentation-Guides-blue.svg" alt="Guides" /></a>
    <a href="https://docs.frontend.applications.linkedpipes.com"><img src="https://img.shields.io/badge/Documentation-Frontend-blue.svg" alt="Frontend" /></a>
    <a href="https://docs.backend.applications.linkedpipes.com"><img src="https://img.shields.io/badge/Documentation-Backend-blue.svg" alt="Javadoc" /></a>
    <a href="https://linkedpipes.docs.apiary.io"><img src="https://img.shields.io/badge/Documentation-Backend API-Blue.svg" alt="Apiary" /></a>

</p>

## About

LinkedPipes Applications is a visualization web platform that allows the users to explore, visualize and publish LinkedData based visualizer applications. Applications created with these platforms can be easily published and integrated anywhere on the Web!

• General user documentation and platform tutorials are available [here](docs.applications.linkedpipes.com) <br/>
• Developer oriented frontend documentation and `React` component demos are available [here](docs.frontend.applications.linkedpipes.com) <br/>
• Developer oriented backend documentation and architecture overview are available [here](docs.backend.applications.linkedpipes.com)

## Quick start

The faster way to start your own LinkedPipes Applications platform instance is to execute the production docker-compose setup.

### Prerequisites

• [Docker and Docker-compose](https://www.docker.com)

### Running within `docker-compose`

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/master/lpa-cli.sh -o lpa-cli.sh && ./lpa-cli.sh --production-no-cloning
```

### Default container ports

Once you have started the instance of the platform in `docker-compose`, individual components will be accessible on the following ports by default:

You should be able to access: <br/>
• **Frontend** of LPA at `localhost:9001` <br/>
• **Backend** of LPA at `localhost:9005` <br/>
• Local **Discovery** at `localhost:9000` <br/>
• Local **ETL** at `localhost:8080` <br/>
• Local **Virtuoso** at `localhost:8890`

## Advanced usage

---

For more advanced scenarious and executions of development compose configurations it is recommended to clone the whole repository first and refer to documentation of `lpa-cli.sh` startup commands:

```bash
usage: ./lpa-cli.sh [-dc]|[--detailed-command]
-d   | --development                  Start non persistent development setup (assumes repository is already cloned)
-dp  | --development-persistent       Start non persistend development setup (assumes repository is already cloned)
-p   | --production                   Start persistend production setup (assumes repository is already cloned)
-pnc | --production-no-cloning        Start persistend production setup [NO CLONING REQUIRED ;-)]
-cs  | --clean-storage                Remove 'appdata' and 'data' folders with database data and etc
-sc  | --stop-compose                 Setup whatever configuration setup is currently running
-h   | --help                         Print help documentation
```

## Testing

LinkedPipes Applications uses [BrowserStack](https://www.browserstack.com) for automated integration testing.

<p align="center"><img img width=35% src="https://i.ibb.co/MnhHHBq/Browserstack-logo-2x.png" alt="Browserstack-logo-2x" border="0"><br /></p>
