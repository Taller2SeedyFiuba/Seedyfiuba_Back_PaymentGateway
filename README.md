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

## Usage

```docker
docker-compose up --b
```

### Docs

Swagger is used to document the API structure. 
```
{HOST}/api/api-docs
```

## Testing

#### Unit Tests
```npm
npm run test-api
```

#### Hardhat Tests

```npm
npm run test
```

## Production Deployment CI

This repository is configured using GitHub Actions. When ```main``` is updated an automated deploy is done using CI.

### GitHub Actions secrets

* HEROKU_API_KEY
* HEROKU_APP_NAME

## License
[MIT](https://choosealicense.com/licenses/mit/)