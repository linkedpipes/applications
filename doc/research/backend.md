# Technology stack for backend

- For each option include:
- Language
- Frameworks
- How (easily) is REST API developed
- How (easily) is RDF processed
- How (easily) are HTTP requests done, incl. JSON processing
- Pros and cons

### Play 2.7 (required)
- Written in Scala
- Usable from other programming languages that are compiled to Bytecode
- Primarily designed to be used with Scala and Java

## Language Options

### Scala
- REST
    - there’s supposed to be a router going into particular classes
- HTTP requests & JSON
    - Java’s HTTP client
    - there are some JSON libs 
- RDF:
    - apparently there’s some way to use it in existing backend (see illegibility in cons)
- Deployment:
    - JVM -> Tomcat
- Pros:
    - existing implementation
- Cons:
    - No experience with the language, seems difficult to learn and illegible

### Python
- Python 3.6
- REST
    - Flask, easy to do
- HTTP requests & JSON
    - requests library, JSON out of the box
- RDF
    - there’s RDFLib, needs to be tested
- Deployment
    - WSGI -> container serviced by Apache, nginx, or gunicorn in Docker
- Pros:
    - should be easy to code (if RDFLib is of any use)
    - lot of libraries and simple packaging system in case we need something
    - enough of experience with the language (Alex, Tadeas)
    - we have to rewrite everything
    - expressive
- Cons:
    - we have to rewrite everything
    - maybe: lacks RDF processing

### Java
- REST
    - Spring
    - JAX-RS
- HTTP requests & JSON
    - There are some libraries
- Deployment
    - Tomcat or sth. - there’s a standard way
- RDF
    - RDF4J (previously Sesame)
    - Apache Jena
- Pros
    - Recommended
    - Widely known
    - Experience with the language (Marzia)
    - There are claimed to be RDF processing libraries
- Cons
    - Not expressive (Alex recalls doing simple REST client was quite a lot of work ...)
    - We have to rewrite everything

### Groovy
- Cons:
    - Again, very little experience with the language 
- Pros:
    - Easy to learn
	
## Final Decision

We have decided to go with Java since most of us are actually familiar with the language and some of the available libraries, and it doesn't require a steep learning curve.


