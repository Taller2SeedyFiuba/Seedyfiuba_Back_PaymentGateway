![example workflow](https://github.com/Taller2SeedyFiuba/Seedyfiuba_Back_PaymentGateway/actions/workflows/main.yml/badge.svg)

# SeedyFiuba Back Payments Gateway

Microservice that acts as payment core and connection to ETH network.

### Built With

* [ExpressJS](https://expressjs.com/)
* [Docker](https://www.docker.com/)
* [HardHat]()

### Deployed In
* [Heroku](https://www.heroku.com/) as a Container Registry.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Docker-cli must be installed. 

### Installation

1. Clone the repo
   ```git
   git clone https://github.com/Taller2SeedyFiuba/Seedyfiuba_Back_PaymentGateway
   ```
2. Install NPM packages
   ```npm
   npm install
   ```
3. Set up environment variables based on ```.env.example```.

4. For this service to properly work a SmartContract artifact based on https://github.com/Taller2SeedyFiuba/Seedyfiuba_SmartContract needs to be provided in an env variable. A local node can be run with that repo in JSONRPC mode. If a real test net is used then Infura is the output gateway.
## Usage
Create external network if not exists:

```docker
docker network create my-net
```

Run service with associated DB:

```docker
docker-compose up --b
```

It's important to acknowledge that microservice start may fail if database is not ready. Solution to this situation resides in running the service again.

### Docs

Swagger is used to document the API structure. 
```
{HOST}/api/docs
```

## Testing

#### Unit Tests
```npm
npm run test-api
```

## Production Deployment CI

This repository is configured using GitHub Actions. When ```main``` is updated an automated deploy is done using CI.

### GitHub Actions secrets

* HEROKU_API_KEY
* HEROKU_APP_NAME

## License
[MIT](https://choosealicense.com/licenses/mit/)