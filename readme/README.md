**GCP / GKE sample project**


***
## GCP engines
**GCE (Google Compute engine)** is Google’s IaaS (Infrastructure as a Service) offering. GCE allows you to create your own virtual machine by allocating hardware-specific resources, e.g. RAM, CPU, Storage. It’s almost like building our own computer/workstation and handling all the details of running it.

**GKE (Google Kubernetes Engine)** is GCP’s Container as a Service (CaaS) offering, which allows customers to easily run their Docker containers in a fully managed Kubernetes environment. It provides you very fine grained control over everything about your cluster.

**GAE (Google App Engine)** runs your apps with as little configuration/management as possible.

![Engines](./images/engines.png)


***
## GKE Architecture

### Cluster
A cluster consists of at least one cluster master and multiple worker machines called Nodes.
**Nodes** contain **Pods** and **Docker Containers**. These resources, whether for applications or batch jobs, are collectively called **Workloads**.

![Cluster](./images/cluster.png)

### Node pool
It is a group of nodes within a cluster that all have the same configuration.

![node-pool](./images/node-pool.png)

You can add additional custom node pools of different sizes, zones and types to your cluster. All nodes in any given node pool are identical to one another.

***
## Create GCP account

In your browser open the Google Cloud Console https://console.cloud.google.com/
If you are creating a new email account for GCP, make sure to go incognito or to logout other accounts.
It gives you US $300.00 credit to be spent over a year. That is, you have to be really careful on what you choose, specially on CPU and Memory.

***
## Create a Project

* Open the Cloud Console UI https://console.cloud.google.com and create a new project. My project's name is ** Sample Project GKE**
* Select the Project in the UI.
* Copy the project ID (ex: **sample-project-gke**)
* To select your project in the terminal, open Cloud Shell and select your project in the terminal:

    ![cloud-shell-icon](./images/cloud-shell-icon.png)

***

### Install Google Cloud SDK to your laptop
With this SDK you can run gcloud from your local terminal instead of using the remote **Cloud Shell** terminal available in the browser.
Actually, I am not sure if you will need this local SDK in the future, but now you need to upload your local Docker Images to the **Container Registry** (This is the Google Image Registry).
Next, I will describe the SDK installation on Windows (recommended) and Ubuntu on WSL (Windows Subsystem for Linux).

#### Windows
* Install Docker Desktop for Windows. See https://docs.docker.com/docker-for-windows/install/
* Install Google Cloud SDK to your laptop - https://cloud.google.com/sdk/docs .
    > Google Cloud SDK command lines only work with windows terminal CMD. If you want it to work with Git Bash, you need to install Python.
* Start **Google Cloud SDK Shell** (I guess this is just a simple CMD terminal, I am really not sure)
* Make sure you are in the VPN because next step will config the VPN.
* Run ***gcloud init*** to connect to your GCP project (sample-project-gke)
* gcloud might throw an error due to VPN limitations:

    ![vpn error](./images/vpn-error.png)

* Config the VPN.
* After the VPN config, it requests your GCP credentials and the project to select (sample-project-gke). Configure local Docker to authenticate to GCP Container Registry (you need to run this only once): ***gcloud auth configure-docker***

#### Ubuntu on WSL (Windows Subsystem for Linux)

* Install Docker Desktop for Windows (Ubuntu will connect to it)
    * Install Docker Desktop for Windows. See https://docs.docker.com/docker-for-windows/install/
    * Righ click on the tray and select Settings
        
        ![docker-icon](./images/docker-icon.png)

    * Righ click on the tray and select Settings
    * On General, check: **Expose daemon on tcp://localhost:2375 without TLS**. The Docker CLI in Ubunutu will refer to this Docker daemon. 

        ![docker daemon](./images/docker-daemon.png)
        > It mentions *use with caution* because it won't be encrypted (no TLS). However, do not bother with the vulnerability as you are exposing the Docker daemon only to your laptop.
* Ubuntu on WSL
    Source: https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly

    ![ubuntu-docker-daemon](./images/ubuntu-docker-daemon.png)
    > Ubuntu will be installed as a Windows subsystem, that is, it can share a few resources but it is still sort of indepent from Windows (I hope). \
    A Docker client will be added to Ubuntu and connected to the *Docker Desktop* via TCP. \
    The docker images and containers are maintained in the *Docker Desktop*.

    * Follow instructions on https://docs.microsoft.com/en-us/windows/wsl/install-win10 (Ubuntu 18.04 LTS)
    * Open the Ubuntu terminal
    * Update the apt package list: \
    **sudo apt-get update -y**
    * Install Docker's dependencies: \
    **sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common**
    * Download  Docker's public PGP key: \
    **curl -fsSL `https://download.docker.com/linux/ubuntu/gpg` | sudo apt-key add -**
    * Verify the fingerprint: \
    **sudo apt-key fingerprint 0EBFCD88**
    * Add the stable Docker upstream repository: \
    **sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"**
    * Update the apt package list (for the new apt repo) \
    **sudo apt-get update -y**
    * Install the latest version of Docker \
    **sudo apt-get install -y docker-ce**
    * Allow your user to access the Docker CLI without root access \
    **sudo usermod -aG docker $USER**
    * For some reason you need to add **export PATH="$PATH:$HOME/.local/bin"** to your PATH. Open **~/.profile** and copy \
    **export PATH="$PATH:$HOME/.local/bin"**
    * Update your changes \
    **source ~/.profile**
    * Connect to the remote Docker daemon that has been exposed earlier at ***localhost:2375***. Open **~/.bashrc** and copy \
     **export DOCKER_HOST=tcp://localhost:2375**
    * Update your changes \
    **source ~/.bashrc**
    * Test Docker \
    **docker info**
    * Run ***gcloud init*** to connect to your GCP project (sample-project-gke). You may be asked to authenticate to your GCP account, then run **gcloud auth configure-docker**
    * List your GKE projects
    **gcloud projects list**

### GCP Authentication
* In case you need to login again: ***gcloud auth login***

## Create Billing

* Enable GCE (Google Compute Engine)
    
    ![gce](./images/gce.png)

### Enable GKE and Billing

In the *Cloud Console*, make sure the project *Sample Project GKE* is selected.
In the left menu, go to *Kubernetes Engine*. Click on *Sign up for a free trial*. Notice that Google provides US$ 300 credit for 1 year and promises to not charge without your permission.

![free-trial](./images/free-trial.png)

You will be asked to enable billing as well.

### Create a Cluster (Cloud Console)

The *GKE* environment consists of *Compute Engine* instances grouped together to form a cluster. \
A *Compute Engine* is a VM running in Google data centers, these VM's CPU and memory are scalable and configurable.\
You have to be really careful to create a cluster, because the *Compute Engine* cost depends on the CPU, memory, hardware and location. You don't want to spend all of your credits in an expensive VM.\
There is a list of *Compute Engine* locations, and only a few of them provide free tiers.\
These locations are based on Region and Zones.\
Example: ***us-west1-c*** (region=***us-west1***; zone=***c***)

*Compute Engine* free tier recommendations - For details check https://cloud.google.com/free/images/gcp-free-tier
* Your Always Free ***f1-micro VM instance*** limit is by time, not by instance.
* Region: ***us-west1*** (The closest free option to Vancouver)

You have the ability to calculate monthly cost at https://cloud.google.com , select *Pricing* / *Calculators* \
Here is the calculation for the free tier. You can try other configurations, but keep in mind that you have only US$ 300 in credit.

![calculator](./images/calculator.png)

#### Enter Cluster info

To create the cluster, go to the *Cloud Console* / *Kubernetes Engine* / *Cluster* and click on *Create Cluster*. \
Select ***us-west1-c*** (Oregon) and ***f1-micro VM***, and click on *Create*

![create-cluster-basics](./images/create-cluster-basics.png)

![create-cluster-nodes](./images/create-cluster-nodes.png)

#### Coonect to Cluster from local terminal

* In the Cloud Console, left menu, click on Kubertes / Cluster / Connect

    ![connect-cluster](./images/connect-cluster.png)

* Copy the gcloud command, paste it to your local terminal and run it. Your local *kubectl* should be connected now to your cluster.
* List your node pool: ***kubectl get nodes***
* You can also see your nodes in the Cloud Console. In the left menu, click on *Compute Engine* / *VM Instances*

### Create the image
* Enable the Container Registry for your project ( Sample Project GKE). Try either following options, I am really not sure what I‘ve done to get this working:
    * https://console.cloud.google.com/apis/library/containerregistry.googleapis.com
    * Or go to the left menu, section *Tools* / *Container Registry*

    ![container-registry](./images/container-registry.png)

* In the Google Cloud SDK terminal, go to the root folder of the sample-gke nodejs project.
* Build the local docker image [ `docker build -t GCP_CONTAINER_REGISTRY/PROJECT_ID/IMAGE_NAME:TAG .` ]. Example: ***`docker build -t gcr.io/sample-project-gke/sample-gke:v1 .`***
    > VPN troubleshooting: If it is your first ever docker build you may have VPN issues, specially because the first time it downloads a few images that will be saved on your local docker registry, such as *node:lts-alpine*. You can either turn off the VPN or configure it on the Docker Desktop Settings.\
    VPN: `http://webproxystatic-bc.tsl.telus.com:8080`

    ![config-docker-proxy](./images/config-docker-proxy.png)

* To view the image you just created: ***`docker images`***
* Push your image to the *GCP Container Registry*: ***docker push gcr.io/sample-project-gke/sample-gke:v1***

### Upload the image
* Configure local Docker to authenticate to GCP Container Registry (you need to run this only once): ***gcloud auth configure-docker***
* In case you need to login again: ***gcloud auth login***
* To make sure you are logged in, you can list the GKE projects: ***gcloud projects list***
* Push the image: ***`docker push gcr.io/sample-project-gke/sample-gke:v1`***
* To view your uploaded image, go to the GCP console, in the menu, go to the *Tools* section, select *Container Registry / Images*

    ![container-registry](./images/container-registry.png)

***
### Deploy Image

### Command line
You can deploy your docker image through command lines on either, the Google Cloud SDK or the Cloud Shell (Browser)
However, let's skip this part.

*kubectl create deployment sample-gke --image=gcr.io/sample-project-gke/sample-gke:v1*
