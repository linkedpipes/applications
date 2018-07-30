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
#### Flask
- simple, flexible framework

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

#### Play framework
- currently used
- simple, flexible, fast development
- inspired by ASP.NET MVC, Ruby on Rails, Django (ie. fairly common model)
- built in JSON support
- asynchronous requests

#### Spring
- flexible, powerful, widely used
- complex, has steep learning curve

#### JSF
- part of Java EE (ie. standard)
- complex framework, slower development


### Groovy
- Cons:
    - Again, very little experience with the language 
- Pros:
    - Easy to learn
#### Grails
- simple, easy framework
	
## Final Decision
Java seams to be the most fitting choice for a language, as it is a common language for the team. No member is experienced with Scala or Groovy while most are familiar with Java. It is a time proven industry standard language and even for web development it is as good as any. Also it stays close to the original Scala solution (a sibling JVM language), proving its workability and possibly offering at least partial reuse of the current code (high level architecture, etc.).

Without prior experience it is difficult to pick the most appropriate framework, as all the major ones appear to be reasonable picks. Based on the available info and reviews we decided to go with Play, as it looks simple and flexible and also it might be helpful that it is used by the current implementation.

