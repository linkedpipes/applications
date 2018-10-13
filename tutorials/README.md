### Discovery setup tutorial

#### Setup

Please note that the steps below refer is to make members of `LP-Apps` familiar with the basic concepts of using the Discovery service. [Discovery Repo](https://github.com/linkedpipes/discovery). After a certain point of implementation of our own backend inside [LP-Apps Repo](https://github.com/linkedpipes/applications) this tutorial will be either removed or updated.

##### Running locally

1. Clone the discovery repo
   `$ https://github.com/linkedpipes/discovery`
2. Navigate to `src` directory
   `$ cd src`
3. Build and run the project
   `$ sbt compile`
   `$ sbt run`
4. Navigate to `localhost:9000` - the web service should now be ready for handling requests.

##### Running from demo instance

1. There is a demo instance running at the following address [Demo Instance](http://demo.visualization.linkedpipes.com:8080/), simply use postman ot send requests.

#### How to use Discovery API

Analyze the [Discovery API](https://github.com/linkedpipes/discovery/blob/master/src/conf/routes) to see the list of all available `GET` and `POST` requests to discovery service. For exploring the API, it is convenient to use `POSTMAN`.

Example usage:

1. Perform `/discovery/startFromInput` `POST` using `.ttl` config files from [List of Discovery .ttl files](https://github.com/linkedpipes/discovery/tree/master/data/rdf/discovery-input/discovery) and put it into request body as a raw text. As a response you will receive the discovery id.
2. Perform `/discovery/:id/pipelines` to see the list of available pipelines. Replace the `:id` part with id from previous call (which is `/discovery/startFromInput`)

### ETL installation tutorial (To be modified)

#### Clone and load dependencies

```
$ git clone https://github.com/linkedpipes/etl.git
$ cd etl
$ mvn install
$ cp configuration.properties.sample deploy/configuration.properties
```

#### Execute required services

```
$ cd deploy
$ ./executor.sh >> executor.log &
$ ./executor-monitor.sh >> executor-monitor.log &
$ ./storage.sh >> storage.log &
$ ./frontend.sh >> frontend.log &
```

In case of error, try executing each service in separate console windows.
After that, navigate to `localhost:8080` to load frontend app.
