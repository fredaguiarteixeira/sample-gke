**GCP / GKE sample project**


***
## GCP engines
**GCE (Google Compute engine)** is Google’s IaaS (Infrastructure as a Service) offering. GCE allows you to create your own virtual machine by allocating hardware-specific resources, e.g. RAM, CPU, Storage. It’s almost like building our own computer/workstation and handling all the details of running it.

**GKE (Google Kubernetes Engine)** is GCP’s Container as a Service (CaaS) offering, which allows customers to easily run their Docker containers in a fully managed Kubernetes environment. It provides you very fine grained control over everything about your cluster.

**GAE (Google App Engine)** runs your apps with as little configuration/management as possible.

![Engines](./docs/engines.png)


***
## GKE Architecture

### Cluster
A cluster consists of at least one cluster master and multiple worker machines called Nodes.
**Nodes** contain **Pods** and **Docker Containers**. These resources, whether for applications or batch jobs, are collectively called **Workloads**.

![Cluster](./docs/cluster.png)


***
## Cluster Orchestration
The nodes, pods, containers and others are orchestrated by Kubernetes via Kubectl, gcloud and the Cloud Console.

* **Cloud Shell** is a shell environment for managing resources hosted on Google Cloud. It comes with kubectl and gcloud.

* **Kubectl** is a command-line client that calls the Kubernetes APIs. It provides the primary command-line interface for running commands against Kubernetes clusters.

* **gcloud** is a tool that provides the primary command-line interface for Google Cloud, and kubectl provides the primary command-line interface for running commands against Kubernetes clusters.

* **Cloud Console**: You can also use the UI instead of Kubectl and gcloud.


***
## Create a GCP Project

* Open the Cloud Console UI https://console.cloud.google.com and create a new project. My project's name is **Zinc Proton**
* Select the Project in the UI.
* Copy the project ID (ex: **zinc-proton-272919**)
* To select your project in the terminal, open Cloud Shell and select your project in the terminal:

    ![cloud-shell-icon](./docs/cloud-shell-icon.png)

* then run ***gcloud config set project zinc-proton-272919***
* Enable GCE (Google Compute Engine)
    
    ![gce](./docs/gce.png)


***
## Deploy an application (Hard way)

### Create a Cluster
You can create a cluster in either the command line or in the Cloud Console UI. Go to Kubernetes Engine / Cluster and click on Create Cluster
I would recommend creating everything from now on in the same Region and Zone.
Example: ***us-central1-c*** (region: ***us-central***; zone: ***c***)

### Install Google Cloud SDK to your laptop
With this SDK you can run gcloud from your local terminal instead of using the remote **Cloud Shell** terminal available in the browser.
Actually, you may never need this local SDK in the future, but now you need to upload your local Docker Images to the **Container Registry** (This is the Google Image Registry).

* Install Google Cloud SDK to your laptop - https://cloud.google.com/sdk/docs .
    > Google Cloud SDK command lines only work with windows terminal CMD. If you want it to work with Git Bash, you need to install Python.
* Start **Google Cloud SDK Shell** (This is a CMD terminal)
* Make sure you are in the VPN because next step will config the VPN.
* Run ***gcloud init*** to connect to your GCP project (zinc-proton-272919)
* gcloud will throw an error due to VPN limitations. This error is expected

    ![vpn error](./docs/vpn-error.png)

* Config the VPN:
    * Do you have a network proxy you would like to set in gcloud (Y/n)?  y
    * Select the proxy type:  ***HTTP***
    * Enter the proxy host address: ***`webproxystatic-bc.tsl.telus.com`***
    * Enter the proxy port: ***8080***
    * Is your proxy authenticated (y/N)?  ***y***
    * Enter the proxy username: ***tid***
    * Enter the proxy password: ***12345***
* After the VPN config, it requests your GCP credentials and the project to select (zinc-proton-272919)

### Create the image
* Enable the Container Registry for your project (Zinc Proton). Try either following options, I am really not sure what I‘ve done to get this working:
    * https://console.cloud.google.com/apis/library/containerregistry.googleapis.com
    * Or go to menu Tools / Container Registry
* Install a Docker Desktop in your laptop

* In the Google Cloud SDK terminal, go to the root folder of the sample-gke project. If it is your first ever docker build you may have VPN issues.
* Build the local docker image [ `docker build -t GCP_CONTAINER_REGISTRY/PROJECT_ID/IMAGE_NAME:TAG .` ]. Example: ***`docker build -t gcr.io/zinc-proton-272919/sample-gke:v1 .`***
* To view the image you just created: ***`docker images`***

### Upload the image
* Configure local Docker to authenticate to GCP Container Registry (you need to run this only once): ***gcloud auth configure-docker***
* In case you need to login again: ***gcloud auth login***
* To make sure you are logged in, you can list the GKE projects: ***gcloud projects list***
* Push the image: ***docker push gcr.io/zinc-proton-272919/sample-gke:v1***

> In the future, these steps will be achieved by **Cloud Build** and **Spinnaker** that will pull your project from github automatically, and build the image in GKE. However, it is good to understand how the manual fashion works to have a better idea how the full process work.

