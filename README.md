# ngx-firebase-web-authn
#### `AngularFire` `Firebase Authentication` `Firebase Functions` `Firestore` `SimpleWebAuthn`
An Angular Firebase extension for authentication with WebAuthn passkeys.
### [@ngx-firebase-web-authn/browser](libs/browser)
#### Exported methods
```ts
createUserWithPasskey: (auth: Auth, functions: Functions, displayName: string) => Promise<UserCredential>;
signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential>;
confirmUserWithPasskey: (auth: Auth, functions: Functions) => Promise<void>;
```
`createUserWithPasskey` and `signInWithPasskey` should only be used when a user is not signed in or is signed in anonymously. Users are signed in anonymously first, which may make data disappear before the passkey window appears and is completed.

Also note that `displayName` is not stored except in the passkey, and can be changed by the user. Once users are signed in, your app should create a document in a separate `users`/`profiles` collection to store user information.

Designed to be used just like native Firebase Authentication providers:
```ts
import { CommonModule }                   from "@angular/common";
import { Component }                      from "@angular/core";
import { Auth, UserCredential }           from "@angular/fire/auth";
import { Functions }                      from "@angular/fire/functions";

import { createUserWithPasskey }          from "@ngx-firebase-web-authn/browser";
import { createUserWithEmailAndPassword } from "@angular/fire/auth";


@Component()
export class SignUpComponent {

  constructor(
    private readonly auth: Auth,
    private readonly functions: Functions,
  ) {
    // ngxFirebaseWebAuthn usage
    this
      .createUserWithPasskey = (displayName: string): Promise<void> => createUserWithPasskey(auth, functions, displayName)
      .then<void>((_userCredential: UserCredential): void => void(0));

    // AngularFire usage
    this
      .createUserWithEmailAndPassword = (email: string, password: string): Promise<void> => createUserWithEmailAndPassword(auth, email, password)
      .then<void>((_userCredential: UserCredential): void => void(0));
  }

  public readonly createUserWithPasskey: (displayName: string) => Promise<void>;
  public readonly createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;

}
```
Add `.catch<void>((reason: any): void => console.error(reason))` to these methods for an error code that may point to one of your Firebase Functions. If the user cancels `createUserWithPasskey`, the method throws `"ngxFirebaseWebAuthn/createUserWithPasskey: Cancelled by user."`, for example.
### [@ngx-firebase-web-authn/functions](libs/functions)
This package contains six Firebase Functions used to facilitate registering, authenticating, and reauthenticating WebAuthn passkeys. An additional function clears challenges if the user cancels the process.

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
Run `npm install` inside `libs/ngx-firebase-web-authn-functions`.

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
          "source": "/ngxFirebaseWebAuthn/createReauthenticationChallenge",
          "function": "ngxFirebaseWebAuthnCreateReauthenticationChallenge"
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
          "source": "/ngxFirebaseWebAuthn/verifyReauthentication",
          "function": "ngxFirebaseWebAuthnVerifyReauthentication"
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

Assign the `allUsers` principal the `Cloud Function Invoker` role on each Cloud Function.
