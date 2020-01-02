# Discovery - Crawler
Worker nodes that are in charge of picking up tasks from Amazon SQS, crawling the pages, and sending the outgoing links back to the master node.

## Steps to Run 
### Locally 
```
export AWS_DISCOVERY_CRAWLER_ACCESS_KEY_ID=<KEY>
export AWS_DISCOVERY_CRAWLER_SECRET_ACCESS_KEY=<KEY>

npm start
```

### Local - Docker
```
docker build --no-cache -t gcr.io/castroom/discovery-crawler:v1 .
docker run --rm --env-file prod.env gcr.io/castroom/discovery-crawler:v1
```