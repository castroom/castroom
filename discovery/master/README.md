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

## Deploying
### First-time Deployment
1) Create the cluster
```
gcloud container clusters create discovery-master \
    --num-nodes 1 \
    --enable-basic-auth \
    --issue-client-certificate \
    --zone us-central1-b
```

2) Verify by listing all the nodes in the container cluster
```
kubectl get nodes
```

3) Build and Push the image
```
docker build --no-cache -t gcr.io/castroom/discovery-master:v1 .
docker push gcr.io/castroom/discovery-master:v1
```

4) Deploy the image
```
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

7) Create service for port
```
kubectl apply -f service.yaml
```

8) Copy the nodePort
```
kubectl get service discovery-master-service --output yaml 
```

9) Copy the External IP
```
kubectl get nodes --output wide
```

10) Add a firewall rule to open the port
```
gcloud compute firewall-rules create discovery-master-port --allow tcp:[NODE_PORT]
```

### Viewing Logs
```
// copy the pod name
kubectl get pods

kubectl logs <POD_NAME> 
```

### Turning off (without shutting down)
```
kubectl scale --replicas=0 deployment discovery-master-deployment

gcloud container clusters resize discovery-master --node-pool default-pool \
    --num-nodes 0
```

### Turning back on
```
gcloud container clusters resize discovery-master --node-pool default-pool \
    --num-nodes 1

// not needed 
kubectl scale --replicas=1 deployment discovery-master-deployment

// copy the new external IP and nodeport
kubectl get service discovery-master-service --output yaml 
kubectl get nodes --output wide

// if the node port changed - add the new firewall rule
gcloud compute firewall-rules create discovery-master-port --allow tcp:[NODE_PORT]

// connect using the new External IP:Node Port
```

### Updating the image
```
// build the new image
docker build --no-cache -t gcr.io/castroom/discovery-master:v2 .
docker push gcr.io/castroom/discovery-master:v2

// change the tag in deployments.yaml 

// deploy the new version 
kubectl apply -f deployment.yaml
```