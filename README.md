
### Configure firebase

Create a project from the [firebase console](https://console.firebase.google.com).

Create a web app from the general tab of your project's settings.

Match the api keys to the variables in`.env.local` file at the root of your project.

#### Enable phone authentication

- from the 'sign-in method' tab of Authentication.

- Edit the configuration for phone

- Enable and save

# Local Dev setup

`yarn install` From your favorite terminal

`yarn dev` to run the application locally.

# Testing

`yarn test` will run your tests

> Test are not configured to work with Vite

# lint

`yarn lint` will analyze your code

# formating

`yarn format` will format your code to projec standards

# Env. rariables

Rename Env. variables:

Old names

    VUE_APP_API_KEY=
    VUE_APP_AUTH_DOMAIN=
    VUE_APP_STORAGE_BUCKET=
    VUE_APP_MESSAGING_SENDER_ID=
    VUE_APP_APP_ID=

New names

    VITE_API_KEY=
    VITE_AUTH_DOMAIN=
    VITE_STORAGE_BUCKET=
    VITE_MESSAGING_SENDER_ID=
    VITE_APP_ID=
