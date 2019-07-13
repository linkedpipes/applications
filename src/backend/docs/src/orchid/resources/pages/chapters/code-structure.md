---
title: "Code Structure"
---

## Code structure

Backend implementation is located inside the `src/backend/` base directory. It is a Gradle-based project, thus it
follows the Gradle directory structure:
```
src/
|-- main/
|   |-- config/                                             contains the configuration files
|   |-- java/                                               contains the Java source code
|   |   |-- com/linkedpipes/lpa/backend/                    base package
|   |       |-- controllers/                                contains all controllers
|   |       |-- entities/                                   contains the data model
|   |       |-- services/                                   contains all services
|   |       |-- ...
|   |-- resources/                                          contains the related classpath resources
|       |-- com/linkedpipes/lpa/backend/services/base.ttl   The base.ttl file
|       |-- ...
|-- test/
    |-- java/                                               contains the test source code
    |-- resources/                                          contains the related classpath resources
```
