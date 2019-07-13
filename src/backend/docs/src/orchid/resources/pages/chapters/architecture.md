---
title: "Architecture"
---

## Backend high-level architecture

As per the aforementioned MVC architecture model, LPA Backend contains following main architectural components:

- **Controllers** that handle deserialization and serialization of the payloads and parameters of the HTTP requests and
  responses. These classes are located in the
  [`com.linkedpipes.lpa.backend.controllers`](/com/linkedpipes/lpa/backend/controllers) java package. The controllers
  utilize _services_ which implement the application's business logic
- **Services** are located in [`com.linkedpipes.lpa.backend.services`](/com/linkedpipes/lpa/backend/services) and
  provide a use-case drive high-level abstraction over the performed tasks
- **Model** entities which are persisted in the persistence layer of Backend; for more information see classes in
  [`com.linkedpipes.lpa.backend.entities.database`](/com/linkedpipes/lpa/backend/entities/database).

Usually, one controller method corresponds directly to one service method, although this may not be the case in all
circumstances. A general invocation of a controller method can be split into these tasks:

- receives an HTTP request
- deserializes the payload and parameters of the request
- validates the payload and parameters
- calls a corresponding service method (or several)
- serializes the response payload
- returns an HTTP response back to the requester
