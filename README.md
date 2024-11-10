## Run the service

1. Create .env files
```
echo "POSTGRESDB_USER=user\nPOSTGRESDB_ROOT_PASSWORD=pw\nPOSTGRESDB_DATABASE=auth\nPOSTGRESDB_LOCAL_PORT=5432\nPOSTGRESDB_DOCKER_PORT=5432" > deployments/dev/.env
```
```
echo "PORT=8080\nNODE_ENV=development\nDB_USER=user\nDB_PASSWORD=pw\nDB_NAME=auth\nDB_PORT=5432\nJWT_SECRET=jwtSecret\nOTP_SECRET=otpSecret\n" > .env
```

2. Install dependencies
```
yarn
```

3. Start the postgres DB
```
docker compose --file deployments/dev/docker-compose.yml up -d
```

4. Start service
```
yarn start
```

## 

## Threads
| Thread | Mitigation |
| ------ | ----------|
| unauthorized access to the database | enable CloudTrail to track DB and service access |
| SQL injection | Use sequelize |
| DoS | Use AWS WAF |
| Brute force password hacking | Strong password policy and rate limiting / throttling | 

## Left for production:
- clean up expired OTPs
- enable twilio
- add proper logger for production logging
- use API Gateway / rate limiter
- unit tests
  - for the individual functions in the services
- integration tests
  - add tests that spin up a postgres instance and test the endpoints against it like so:
    1. should create new user
    2. should ignore second user if email is identical
    3. should verify password and trigger OTP
    4. should fail if password or email is incorrect
    5. should verify OTP_SESSION cookie and 
- handle concurrency
- don't keep secrets in .env file but rather fetch them from AWS Secrets Manager
  - use staging secrets in development
- thread modelling
- add monitors & analytics
  - for unexpected errors, CPU, memory, disk space, DB response times
- add healthcheck endpoint
- add load balancer in case we need more than one EC2 instance
- add CDK stacks for 
  - keeping credentials
  - RDS postgres
  - EC2 / EBS deployment
  - VPC stack
  - infrastructure stack to connect the stacks above
