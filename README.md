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

## Test the endpoints

1. Import collection (./insomnia-collection.yaml) to insomnia  
(If you don't have insomnia, give me a call and I can send you the CURLs)

2. Create a new user
3. Login  
Check that you now have an OTP_SESSION cookie with a JWT  
Since I didn't create Twilio account, I just logged the OTP in the console.

4. Confirm OTP  
Grab OTP from console and paste it to the request body  
You should now have an ACCESS_TOKEN cookie

5. Edit user  
Only works with valid access token

6. Change password flow:  
Only works with valid access token
    1. Request OTP  
    Once again the OTP is logged in your console  
    2. Paste the OTP to the change password request

## Consideration of threads
| Thread | Mitigation |
| ------ | ----------|
| unauthorized access to the database | disable production access to the DB, store secrets in AWS secrets manager and enable CloudTrail to track DB and Secret Manager access |
| SQL injection | Use sequelize |
| DoS | Use AWS WAF |
| Brute force password hacking | Strong password policy and rate limiting / throttling | 
| Cross-Site Scripting (XSS) | strict input validation |

## Left to do for production use:
- clean up expired OTPs via cron job or switch to DynamoDB / Redis and set TTL
- enable twilio
- add proper logger for production logs (including Correlation ID)
- use rate limiter / throttler
- add unit tests
  - for the individual functions in the services
- integration tests
  - add tests that spin up a postgres instance and test the endpoints against it like so:
    1. should create new user
    2. should ignore second user if email is identical
    3. should verify password and trigger OTP
    4. should fail if password or email is incorrect
    5. should verify OTP_SESSION cookie and 
- don't keep secrets in .env file but rather fetch them from AWS Secrets Manager
  - use staging secrets in development
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
