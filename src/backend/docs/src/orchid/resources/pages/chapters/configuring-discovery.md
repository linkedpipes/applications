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

### Structure of a transformer

A transformer's main behavior-defining parts are:
* **Descriptor query** which Discovery uses to determine whether the transformer is suitable for a data set. This is
  usually a SPARQL `ASK` query, which searches for patterns in the data. If the `ASK` query is satisfied, the
  transformer is suitable for that data set.
* **Transformation query** which is used both by Discovery to transform the data sample at Discovery's run time, and by
  ETL to transform the full data set during pipeline execution. This is usually a SPARQL `DELETE/INSERT` query which
  searches for and then replaces patterns in the data.
  
### Creating a custom transformer

To create and add a custom transformer to `base.ttl`, we recommend reusing an existing transformer first and modifying its
contents to suit your needs.
 
Suppose we have our own RDF vocabulary called `MAV` (short for _My Amazing Vocabulary_) with URI
`https://example.com/vocabulary/mav/`, and suppose there exists a predicate `mav:name`. In the following example, we
will extend and modify the
[Schema Name to DCTerms Title](https://discovery.linkedpipes.com/resource/transformer/schema-name-to-dcterms-title/template)
transformer to one which transforms our `mav:name` predicate into `dcterms:title`. We will call it **MAV Name to DCTerms
Title**.

First we modify lines 6 and 7 of the original transformer by replacing the prefix URIs with new ones which will serve as
a unique identifier for our new transformer:

```
 6: @prefix transformer:  <https://example.com/transformer/mav-name-to-dcterms-title/> .
 7: @prefix configuration-vocabulary:  <https://example.com/transformer/mav-name-to-dcterms-title/configuration/> .
```

Next we modify lines 10, 17, 53, and 59 by rewriting the descriptions of the transformer, its class of configurations,
its input, and its main feature:

```
10:   dcterms:title "My Amazing Vocabulary name to Dublin Core terms title"@en;
...
17:   rdfs:label "Class of configurations of My Amazing Vocabulary name to Dublin Core terms title"@en;
...
53:   dcterms:title "Triples with My Amazing Vocabulary name predicate" .
...
59:   dcterms:title "Transforms My Amazing Vocabulary name to Dublin Core terms title" ;
```

Note that we do not need to modify line 56 since we are not changing the behavior of the transformer's output.

Finally, we change the function of the transformer by replacing the descriptor query (starting on line 63) and 
transformation query (line 22) with our own. Our new descriptor query will check for the presence of the `mav:name`
predicate and the new transformation query will replace all occurrences with `dcterms:title`:

```
22:   lpd:query  """
23: PREFIX mav: <https://example.com/vocabulary/mav/>
24: PREFIX dcterms: <http://purl.org/dc/terms/>
25: 
26: DELETE {
27:   ?s mav:name ?name .
28: }
29: INSERT {
30:   ?s dcterms:title ?name .
31: } 
32: WHERE {
33:   ?s mav:name ?name .
34: }
35:   """ ;
...
63:   lpd:query """
64: PREFIX mav: <https://example.com/vocabulary/mav/>
65: 
66: ASK {
67:   ?s mav:name ?name .
68: }
69:   """ ;
```

For the last step, we just upload this modified transformer file to a publicly accessible location and add the URI to
the list of transformers in the `base.ttl` file. After recompilation or rebuilding of the backend container, LPA Backend
will be serving the modified base file to Discovery, which will then consider our new transformer as a possible
transformer.
