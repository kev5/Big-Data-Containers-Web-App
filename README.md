# Big Data Containers Web App

This web application is developed to demonstrate our implementation of a [`dataverse-broker`](https://github.com/SamiSousa/dataverse-broker).

The workflow of our entire project can be described as follows-

1. First, a user selects a service (for example- dataverse subtree) from the service catalog on OpenShift, by creating a service instance resource.

2. Then the service catalog calls provision on the broker.

3. The user creates an application in OpenShift either by creating a new app or configures an existing app. In this case, we are having this sample web app.

4. The service catalog calls bind on the broker and then injects the result of this bind into a secret.

5. Our web app will use this secret to consume dataverses/datasets/files from the selected dataverse subtree.

6. The app does not interact with the broker itself, but it gets injected with the information from a secret. The app basically reads particular environment variables on start-up to get the information from a secret.

Note: This web application is a part of [BU EC528 Cloud Computing](https://github.com/BU-NU-CLOUD-SP18/Big-Data-Containers) project: Big Data Containers.
