# Discovery - Master
The master node that is in charge or coordinating the crawl jobs. It handles the crawl start, as well as the caching mechanism that acts as a middle-man between the worker nodes and Amazon SQS.

## Steps to Run 
### Locally
```
export AWS_DISCOVERY_MASTER_ACCESS_KEY_ID=<KEY>
export AWS_DISCOVERY_MASTER_SECRET_ACCESS_KEY=<KEY>

npm start
```

### Local - Docker
```
docker build --no-cache -t gcr.io/castroom/discovery-master:v1 .
docker run --rm -p 8080:8080 --env-file prod.env gcr.io/castroom/discovery-master:v1
```