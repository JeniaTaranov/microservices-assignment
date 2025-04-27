# microservices-assignment
Microservices System: User, Order, Auth, Gateway

How to start?
- You need to have Docker and Docker Compose installed

How to run the system? From the root - 
1. $ init.sh
2. Run the following comment in the terminal root directory: 
$ docker-compose up --build

Services will be available at:
* API Gateway: http://localhost:3000
* Auth Service: http://localhost:3003
* MQ //todo

Running tests: 
$ npm install
inside tests folder, run: 
$ npm run test

Environment Variables

Common variables (set via Docker Compose or .env):

Notes

Use Authorization: Bearer <token> header for API Gateway requests.
Get the JWT token by logging in via POST /auth/login.
PostgreSQL and MQ are automatically started via Docker Compose.