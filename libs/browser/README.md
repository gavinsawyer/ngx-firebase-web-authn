## @ngx-firebase-web-authn/browser
An unofficial AngularFire extension for authentication with WebAuthn passkeys.

### Deprecated: This project is now [FirebaseWebAuthn](https://github.com/gavinsawyer/firebase-web-authn) version 9.
### Methods
```ts
import { createUserWithPasskey, signInWithPasskey, verifyUserWithPasskey } from "@ngx-firebase-web-authn/browser";
```
```ts
createUserWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential>;
    signInWithPasskey: (auth: Auth, functions: Functions)               => Promise<UserCredential>;
verifyUserWithPasskey: (auth: Auth, functions: Functions)               => Promise<void>;
```
Passkeys can be used as a secondary auth provider, as well:
```ts
import { linkWithPasskey, unlinkPasskey } from "@ngx-firebase-web-authn/browser";
```
```ts
linkWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential>;
  unlinkPasskey: (auth: Auth, functions: Functions)               => Promise<void>;
```
Designed to be used like the Firebase JavaScript API (version 9):
```ts
import { Auth }                           from "@angular/fire/auth";
import { Functions }                      from "@angular/fire/functions";
import { createUserWithEmailAndPassword } from "@angular/fire/auth";
import { createUserWithPasskey }          from "@ngx-firebase-web-authn/browser";
```
```ts
class SignUpComponent {

  constructor(
    private readonly auth: Auth,
    private readonly functions: Functions,
  ) {
    // AngularFire usage
    this
      .createUserWithEmailAndPassword = (email: string, password: string): Promise<void> => createUserWithEmailAndPassword(auth, email, password)
      .then((): void => void(0));
  
    // ngxFirebaseWebAuthn usage
    this
      .createUserWithPasskey = (name: string): Promise<void> => createUserWithPasskey(auth, functions, name)
      .then((): void => void(0));

  }

  public readonly createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  public readonly createUserWithPasskey: (name: string) => Promise<void>;

}
```
Add `.catch((err: NgxFirebaseWebAuthnError): void => console.error(err))` to these methods for a detailed error object with a `code`, `message`, `method`, and/or `operation`. `method` is present for Firebase errors, and `operation` is present on all errors except Firebase errors from Auth methods:
```ts
import { NgxFirebaseWebAuthnError } from "@ngx-firebase-web-authn/browser";
```
```ts
class NgxFirebaseWebAuthnError extends Error {
  code: `ngxFirebaseWebAuthn/${FirebaseError["code"] | "missing-auth" | "missing-user-doc" | "no-op" | "not-verified" | "user-doc-missing-challenge-field" | "user-doc-missing-passkey-fields" | "cancelled" | "invalid"}`;
  message: FirebaseError["message"] | "No user is signed in." | "No user document was found in Firestore." | "No operation is needed." | "User not verified." | "User doc is missing challenge field from prior operation." | "User doc is missing passkey fields from prior operation.";
  method?: "httpsCallableFromURL" | "signInAnonymously" | "signInWithCustomToken";
  operation?: "clear challenge" | "clear user doc" | "create authentication challenge" | "create reauthentication challenge" | "create registration challenge" | "verify authentication" | "verify reauthentication" | "verify registration";
}
```
### Caveats
- Your backend security logic should depend on the `lastVerified` field in the user's document in the `webAuthnUsers` collection which is updated automatically on sign-in and verification.
- The `name` parameter is not stored except in the passkey and can be changed by the user without the app being able to know. Once users are signed in, your app should create a document in a separate `users`/`profiles` collection to store user information.
- An anonymous user linked with a passkey is the same as a user created with `createUserWithPasskey`, and is marked by Firebase as having no provider.
- Because users don't change their `uid` between starting and completing creating an account, your app should listen to `onIdTokenChanged` rather than `onAuthStateChanged`.
