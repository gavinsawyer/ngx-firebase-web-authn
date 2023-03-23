# ngx-firebase-web-authn
#### `Angular Firebase` `Firebase Authentication` `Firebase Functions` `SimpleWebAuthn`
## [@ngx-firebase-web-authn/browser](packages/browser)
`% npm install @ngx-firebase-web-authn/functions --save`
#### Exported methods
```ts
createUserWithPasskey: (auth, functions, displayName: string) => Promise<UserCredential>
signInWithPasskey: (auth, functions) => Promise<UserCredential>
```
### [@ngx-firebase-web-authn/functions](packages/functions)
`% npm install @ngx-firebase-web-authn/functions --save-dev`

This package contains four Firebase Functions used to facilitate registering and authenticating WebAuthn passkeys. An additional function clears challenges if the user cancels the process.
### Deploying functions w/ existing Firebase Functions directory
Re-export this package from your `functions/index.ts` file.
```ts
import { initializeApp } from "firebase-admin/app";


initializeApp();

export * from '@ngx-firebase-web-authn/functions'

// Other functions...
```
Deploy your firebase functions.

`% firebase deploy --only functions`
### Deploying functions w/ Nx
Copy this package to your Nx workspace.

Be sure to include the correct path in your `tsconfig.base.json`.
```json
"paths": {
  "functions": ["libs/functions/src/index.ts"]
}
```
Add the following object to the `functions` array in your `firebase.json`.
```json
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
    "source": "dist/libs/functions"
  }
]
```
Run the `deploy` target

`% npx nx run functions:deploy`
- Builds library with tsc, outputs to `dist/libs/functions`.
- Deploys `ngx-firebase-web-authn` codebase using the Firebase CLI.
### Using functions
For the browser to reach your functions, add the following objects to the `rewrites` array in your `firebase.json`. They should be inside the `hosting` object of each app where you'd like to use ngxFirebaseWebAuthn.
```json
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
```
### Google Cloud setup
Assign the Default Compute Service Account the `Service Account Token Creator` role in [GCP IAM Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).

You may also need to assign the `allUsers` principal the `Cloud Function Invoker` role on each Cloud Function.
