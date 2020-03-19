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

## Deploying
### First-time Deployment

> Make sure that all the missing values are provided in `deployment.yaml`


1) Create the cluster
```
gcloud container clusters create discovery-crawler --preemptible \
    --num-nodes 3 \
    --enable-basic-auth \
    --issue-client-certificate \
    --zone us-central1-b --enable-autoscaling --min-nodes 2 --max-nodes 4
```

2) Verify by listing all the nodes in the container cluster
```
kubectl get nodes
```

3) Build and Push the image
```
docker build --no-cache -t gcr.io/castroom/discovery-crawler:v1 .
docker push gcr.io/castroom/discovery-crawler:v1
```

4) Deploy the image
```
// make sure to update all the flags before deploying
kubectl apply -f deployment.yaml
```

5) Track the status of the deployment
```
kubectl get deployments
```

6) After deployment is complete, check the pods that the deployment created
```
kubectl get pods
```


### Viewing Logs
```
// copy the pod name
kubectl get pods

kubectl logs <POD_NAME> 
```

### Turning off
```
kubectl scale --replicas=0 deployment discovery-crawler-deployment

gcloud container clusters resize discovery-crawler --node-pool default-pool \
    --num-nodes 0
```

### Turning back on
```
gcloud container clusters resize discovery-crawler --node-pool default-pool \
    --num-nodes 3

// not needed 
kubectl scale --replicas=12 deployment discovery-crawler-deployment
```

### Updating the image
```
// build the new image
docker build --no-cache -t gcr.io/castroom/discovery-crawler:v2 .
docker push gcr.io/castroom/discovery-crawler:v2

// change the tag in deployments.yaml 

// deploy the new version 
kubectl apply -f deployment.yaml
```