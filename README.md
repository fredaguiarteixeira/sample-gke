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

* Open the Cloud Console UI and create a new project. My project's name is **Zinc Proton**
* Select the Project in the UI.
* Copy the project ID (ex: **zinc-proton-27291**)
* To select your project in the terminal, open Cloud Shell and select your project in the terminal:

    ![cloud-shell-icon](./docs/cloud-shell-icon.png)

* then run ***gcloud config set project zinc-proton-272919***
* Enable GCE (Google Compute Engine)
    
    ![gce](./docs/gce.png)


***
## Deploy a stateless application

### Create a Cluster
You can create a cluster in either the command line or in the Cloud Console UI. Go to Kubernetes Engine / Cluster and click on Create Cluster
I would recommend creating everything from now on in the same Region and Zone.
Example: ***us-central1-c*** (region: ***us-central***; zone: ***c***)

### Create an image
* This next step is really primitive because you have to manually create an image in your local Docker Desktop Image Registry, then push it to the **Container Registry** (This is the Google Image Registry).

* Enable the Container Registry for your project (Zinc Proton). Try either following options, I am really not sure what I‘ve done to get this working:
    * https://console.cloud.google.com/apis/library/containerregistry.googleapis.com
    * Or go to menu Tools / Container Registry
* Install a Docker Desktop in your laptop
* Install Google Cloud SDK to your laptop - https://cloud.google.com/sdk/docs . As far as I remember the connection between your laptop and GCP is handled here.

> In the future, these steps will be achieved by **Cloud Build** and **Spinnaker** that will pull your project from github automatically, and build the image in GKE. However, it is good to understand how the manual fashion works to have a better idea how the full process work.

