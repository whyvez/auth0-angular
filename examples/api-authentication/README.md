# API Authentication Example

These examples show Angularjs client side authentication + server side authentication to APIs.

Sample APIs provided in:

* Node.js API
* ASP.NET Web API Owin
* Java Servlet

> Notice that in both cases we are serving the static html/js files form the same domain. You can easily have two different domains, one hosting the static assets and another completely different hosting the API. In that case, make sure to configure CORS. (see example below)

### Running the example

#### Node.js Backend

In order to run the example, go to the `nodejs` folder and run:
```sh
npm install
```
After doing that, start the server by doing:
```sh
node app.js
```

Open your browser at [http://localhost:1337/](http://localhost:1337).

#### ASP.NET Web API Owin Backend

In order to run the example, go to the `aspnet-owin` folder, open the solution and run it.
Open your browser at [http://localhost:1337/index.html](http://localhost:1337/index.html).

#### Java Servlet

Go to the `java` folder and execute the following mvn command:

```sh
mvn clean install org.mortbay.jetty:jetty-maven-plugin:run-war -Djetty.port=1337
```

After the server started, open your browser at [http://localhost:1337/](http://localhost:1337).

### Configuring CORS

#### Node.js API Backend

Firstly install the [node-cors](https://github.com/troygoode/node-cors) npm package

```sh
npm install cors --save
```

The following code demonstrates enabling CORS for all requests using basic headers and methods, see docs for more info.

```js
require cors = require('cors');
...
var corsOptions = { 
  origin: 'http://myFrontendDomain.com',
  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```


