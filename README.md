# Hamster Help Back-End

This repo provides the back end services for the Hamster Help platform from `Team Turbo Hamster`. It is designed to work in conjunction with the [Hamster Help Front-End]([https://github.com/teamturbohamster/hamster-help-fe).

## Set Up for Local Development

### Requirements:

- Node.js v17.2^
- NPM v8.1.4^

### Clone and Install Dependencies

Enter the following commands to clone and install dependencies for this project:

```
    git clone https://github.com/team-turbo-hamster/hamster-help-be

    cd hamster-help-be

    npm i
```

### Environment Variables

This project requires several environment variables to be set. Use the command below to copy set up environment variables:

```
    mkdir environment
    cp sample-environment environment/development.js
```

Open `.env.development` and set the keys as below:

- `PORT` - The port you would like the server to run on e.g. `5000`
- `CLIENT_URL` - The URL of the client which will be issuing requests to the Socket.io server e.g. `http://localhost:3000`.

- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` - Cloudinary CDN access to upload

- `DATABASE` - This link will connect your server with Atlas

### Starting the Dev Server

Use the following command to start the development server:

```
    npm start
```
