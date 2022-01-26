# Hamster Help Back-End

This repo provides the back end services for the Hamster Help platform from `Team Turbo Hamster`. It is designed to work in conjunction with the [Hamster Help Front-End]([https://github.com/teamturbohamster/hamster-help-fe).

## Set Up for Local Development

### Requirements:

- Node.js v17.2^
- NPM v8.1.4^
- MongoDB either local or hosted and accessible via URI

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

Open `environment/development.js` and set the keys as below:

- `PORT` - The port you would like the server to run on e.g. `5000`
- `CLIENT_URL` - The URL of the client which will be issuing requests to the Socket.io server e.g. `http://localhost:3000`.

Cloudinary CDN access to upload

- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

MongoDB

- `DATABASE` - This link will connect your server with MongoDB Atlas or a local MongoDB instance (e.g. mongodb://127.0.0.1/database_name)

JSON Web Tokens for Authentication

- `PUBLIC_KEY` - The entire public key (including the -----BEGIN RSA PUBLIC KEY----- and -----END PUBLIC KEY-----) generated by running `node utils/makeKeyPair.js`
- `PRIVATE_KEY` - The entire private key (including the -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----) generated by running `node utils/makeKeyPair.js`
- `JWT_ISSUER` - The issuer of the token - this has been preset to Team Turbo Hamster and does not need to be changed unless another company wishes to use this code
- `JWT_AUDIENCE` - The audience of the token - this has been preset to Hamster Help, the name of the application issuing this token. This does not need to be changed unless this code is to be used for a different application

### Seeding the Database

Use the following command to seed the database:

```
    npm run seed-dev
```

### Starting the Dev Server

Use the following command to start the development server:

```
    npm run start-dev
```
