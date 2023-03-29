# ngx-firebase-web-authn
#### `AngularFire` `Firebase Authentication` `Firebase Functions` `Firestore` `SimpleWebAuthn`
An Angular Firebase extension for authentication with WebAuthn passkeys.

See the demo online at https://ngx-firebase-web-authn.web.app.
### [@ngx-firebase-web-authn/browser](libs/browser)
`% npm install @ngx-firebase-web-authn/browser --save`
#### Usage
```ts
import { createUserWithPasskey, signInWithPasskey, verifyUserWithPasskey } from "@ngx-firebase-web-authn/browser";

createUserWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential>;
signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential>;
verifyUserWithPasskey: (auth: Auth, functions: Functions) => Promise<void>;
```
Because users don't change their `uid` between starting and completing creating an account, your app should listen to `onIdTokenChanged` rather than `onAuthStateChanged`.

`verifyUserWithPasskey` resolves if the user was re-verified, but your backend logic should depend on the `lastVerified` field in the user's document in the `ngxFirebaseWebAuthnUsers` collection which is updated automatically.

Also note that `name` is not stored except in the passkey, and can be changed by the user without the app being able to know. Once users are signed in, your app should create a document in a separate `users`/`profiles` collection to store user information.

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
      .createUserWithPasskey = (name: string): Promise<void> => createUserWithPasskey(auth, functions, name)
      .then<void>((_userCredential: UserCredential): void => void(0));

    // AngularFire usage
    this
      .createUserWithEmailAndPassword = (email: string, password: string): Promise<void> => createUserWithEmailAndPassword(auth, email, password)
      .then<void>((_userCredential: UserCredential): void => void(0));
  }

  public readonly createUserWithPasskey: (name: string) => Promise<void>;
  public readonly createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;

}
```
Add `.catch<void>((reason: any): void => console.error(reason))` to these methods for an error code. If the user cancels `createUserWithPasskey`, the method throws `"ngxFirebaseWebAuthn/createUserWithPasskey: Cancelled by user."`, for example.
### [@ngx-firebase-web-authn/functions](libs/functions)
This package contains a Firebase Function used to facilitate registering, authenticating, reauthenticating WebAuthn passkeys, and clearing challenges if the user cancels the process.

Public keys are stored in the `ngxFirebaseWebAuthnUsers` collection in Firestore. Setup doesn't require you to modify any Firestore rules. Your app should use a separate `users`/`profiles` collection to store user information.
### Deployment
From your Firebase Functions package root, run:

`% npm install @ngx-firebase-web-authn/functions --save`

Re-export the function from your `functions/index.ts` file.
```ts
import { initializeApp } from 'firebase-admin/app';


initializeApp();

export { ngxFirebaseWebAuthn } from '@ngx-firebase-web-authn/functions';

// Other functions...
```
Deploy your Firebase Functions:

`% firebase deploy --only functions`
### Usage
For the browser to reach ngxFirebaseWebAuthn, modify your `firebase.json` to include a rewrite on each app where you'd like to use passkeys.
```json
{
  "hosting": [
    {
      "target": "...",
      "rewrites": [
        {
          "source": "/ngxFirebaseWebAuthn",
          "function": "ngxFirebaseWebAuthn"
        }
      ]
    }
  ]
}
```
### Google Cloud setup
Assign the Default Compute Service Account the `Service Account Token Creator` role in [GCP IAM Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts). This is required for all custom authentication patterns with Firebase.
