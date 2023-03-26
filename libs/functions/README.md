## @ngx-firebase-web-authn/functions
An Angular Firebase extension for authentication with WebAuthn passkeys.

See the demo online at https://ngx-firebase-web-authn.web.app.

This package contains six Firebase Functions used to facilitate registering, authenticating, and reauthenticating WebAuthn passkeys. An additional function clears challenges if the user cancels the process.

Functions store users' public keys in the `ngxFirebaseWebAuthnUsers` collection in Firestore. Setup doesn't require you to modify any Firestore rules. Your app should use a separate `users`/`profiles` collection to store user information.
### Deploying functions
From your functions package root, run:

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
