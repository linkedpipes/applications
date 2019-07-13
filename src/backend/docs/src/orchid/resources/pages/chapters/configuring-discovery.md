---
title: "Configuring Discovery"
---

## Discovery configuration and <code>base.ttl</code>

As mentioned earlier, the Backend is tasked, among others, to start new runs of Discovery. _LinkedPipes Discovery_ was
created to be a stateless service. As such, upon each invocation, Discovery needs to be provided a complete run
configuration, consisting of a list of _pipeline components_ to use in the pipeline discovery process. These components
are divided into several categories. The most important of these are:

- _Data sources_ which say where the pipeline should retrieve the raw data set from
- _Transformers_ which say how to partially transform the data set into another state and whether or not the
  transformation is applicable to a data set
- _Visualizers_&mdash;also called Applications&mdash;which say how to visualize a data set and whether or not the
  visualizer is applicable to a data set

The available transformers and visualizers almost never change between Discovery invocations, only the data sources are
being added as per the user's requests. Due to this reason Backend keeps a _base Discovery configuration_ file
`base.ttl` available as a Java classpath resource located in
`/src/backend/src/main/resources/com/linkedpipes/lpa/backend/services/base.ttl`. This file can be modified by adding or
removing transformers or visualizers, which changes which pipeline components are considered during the pipeline
discovery process.
