## Deploy to Heroku 
```
docker build --no-cache -t castroom/api:v1 .
docker run --rm -p 8080:8080 castroom/api:v1
heroku container:push web --app castroom-api
heroku container:release web --app castroom-api
heroku open --app castroom-api
```
