![githubheader](https://user-images.githubusercontent.com/4590693/71388932-9e1a7b80-25b7-11ea-9a00-31b965cc1078.png)

# Overview
Castroom is a podcast search engine. It was primarily made to learn how to make a distributed web crawler using Kubernetes. It is capable of gathering hundreds of thousands of podcasts within a few hours, and can easily be scaled up even more with one simple command. 

# Project Structure
### Discovery
#### Master
- coordinates all the `crawler` jobs
- maintains a local cache (using LevelDB) to prevent the same URL from being crawled multiple times
- receives data from the `crawler` nodes and pushes both the queue
- the `crawler` nodes send all data to this node after crawling a website
- send the data to ElasticSearch on completion
- managed by Google Kubernetes Engine
#### Crawler
- crawls iTunes podcast pages and sends batched data to the `master` node for caching 
- goes through a proxy to bypass certain restrictions
- managed by Google Kubernetes Engine
### API 
- provides endpoints for querying Elasticsearch and retriving podcast Feed information
- hosted on Heroku
### Web
- frontend for the search engine
- managed by Firebase Hosting

![project-structure](https://user-images.githubusercontent.com/4590693/77203566-5754f880-6ab6-11ea-91ba-1bc234ae1d2d.png)

# Technologies Used
- Docker
- Google Kubernetes Engine
- Amazon Simple Queue Service
- Amazon Elasticsearch Service
- Heroku
- Firebase Hosting
- React
- Node.js
- LevelDB
- Datadog

# Screenshots
<img width="1284" alt="Search" src="https://user-images.githubusercontent.com/4590693/72404218-c4908a00-3711-11ea-9bd1-c3c6a1bbb4c5.png">
<img width="1286" alt="Search Results" src="https://user-images.githubusercontent.com/4590693/72404219-c4908a00-3711-11ea-87ea-762630172249.png">

<br><br><br><br>

<img width="908" alt="GIF of Castroom" src="https://user-images.githubusercontent.com/4590693/147375107-b367cc1a-3926-4634-9e3d-36c3a6d7b042.gif">

