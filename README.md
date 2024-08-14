## File upload App

### Overview:

- This application has one root endpoint which renders the `index.html`. It allows uploading of files through the HTML. 
- `index.html` will access a second POST endpoint to upload the file.
- An error handler is used for non-existent routes.

### Testing the routes:

- Install and run the server using: `npm install` and `node serverapp.js`.
- Access root from `http://localhost:3000`
- Access an uploaded file named, for example, "hello.txt" from: `http://localhost:3000/file/hello.txt`

### Dockerizing the app:

- `Dockerfile` contains the configuration to create a docker container for the app.
- To build the app with a proper tag, run the command: `docker build . -t uploadapp`.
- Once the build is successful, run start the server with the command: `docker run -dp 3000:3000 uploadapp`
- Launch the app on port 3000

### Deploying the app (IBM Cloud Engine):

- Check if the Code Engine CLI is pre-configured in terminal using the command: ibmcloud ce project current
- Get the namespace: 
```sh
    MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
    echo $MY_NAMESPACE
```
- Build the docker image with a tag (so it can be recognized by Code Engine): 
```sh
docker build . -t us.icr.io/$MY_NAMESPACE/uploadapp
```
- Push the image into the container registry: 
```sh
docker push us.icr.io/$MY_NAMESPACE/uploadapp
```
- Deploy the app on Code Engine: 
```sh
ibmcloud ce application create --name uploadapp --image us.icr.io/$MY_NAMESPACE/uploadapp --registry-secret icr-secret --port 3000
```
- Once successful, use deployment URL to access the app in the cloud