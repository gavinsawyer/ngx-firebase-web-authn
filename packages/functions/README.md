## @ngx-firebase-web-authn/functions
An Angular Firebase extension for authentication with WebAuthn passkeys.

This package contains four Firebase Functions used to facilitate registering and authenticating WebAuthn passkeys. An additional function clears challenges if the user cancels the process.

Functions store users' public keys in the `ngxFirebaseWebAuthnUsers` collection in Firestore. Setup doesn't require you to modify any Firestore rules. Your app should use a separate `users`/`profiles` collection to store user information.
### Deploying functions w/ existing Firebase Functions directory
From your functions directory root, run:

`% npm install @ngx-firebase-web-authn/functions --save`

Re-export this package from your `functions/index.ts` file.
```ts
import { initializeApp } from 'firebase-admin/app';


initializeApp();

export * from '@ngx-firebase-web-authn/functions'

// Other functions...
```
Deploy your firebase functions.

`% firebase deploy --only functions`
### Deploying functions w/ Nx
Copy this package to your Nx workspace as `libs/ngx-firebase-web-authn-functions`.

Be sure to include the correct path in your `tsconfig.base.json`.
```json
{
  "paths": {
    "ngx-firebase-web-authn-functions": [
      "libs/ngx-firebase-web-authn-functions/src/index.ts"
    ]
  }
}
```
Add the following object to the `functions` array in your `firebase.json`.
```json
{
  "functions": [
    {
      "codebase": "ngx-firebase-web-authn",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "runtime": "nodejs18",
      "source": "dist/libs/ngx-firebase-web-authn-functions"
    }
  ]
}
```
Run `npm install` inside `libs/ngx-firebase-web-authn-functions`

Run the `deploy` target in your workspace root:

`% npx nx run ngx-firebase-web-authn-functions:deploy`
- Builds library with tsc, outputs to `dist/libs/ngx-firebase-web-authn-functions`.
- Deploys `ngx-firebase-web-authn` codebase using the Firebase CLI.
### Using functions
For the browser to reach your functions, modify your `firebase.json` to add the following `rewrites` to the `hosting` object of each app where you'd like to use ngxFirebaseWebAuthn.
```json
{
  "hosting": [
    {
      "target": "...",
      "rewrites": [
        {
          "source": "/ngxFirebaseWebAuthn/clearChallenge",
          "function": "ngxFirebaseWebAuthnClearChallenge"
        },
        {
          "source": "/ngxFirebaseWebAuthn/createAuthenticationChallenge",
          "function": "ngxFirebaseWebAuthnCreateAuthenticationChallenge"
        },
        {
          "source": "/ngxFirebaseWebAuthn/createRegistrationChallenge",
          "function": "ngxFirebaseWebAuthnCreateRegistrationChallenge"
        },
        {
          "source": "/ngxFirebaseWebAuthn/verifyAuthentication",
          "function": "ngxFirebaseWebAuthnVerifyAuthentication"
        },
        {
          "source": "/ngxFirebaseWebAuthn/verifyRegistration",
          "function": "ngxFirebaseWebAuthnVerifyRegistration"
        }
      ]
    }
  ]
}
```
### Google Cloud setup
Assign the Default Compute Service Account the `Service Account Token Creator` role in [GCP IAM Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts). This is required for all custom authentication patterns with Firebase.

You also need to assign the `allUsers` principal the `Cloud Function Invoker` role on each Cloud Function.
