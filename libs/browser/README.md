## @ngx-firebase-web-authn/browser
An Angular Firebase extension for authentication with WebAuthn passkeys.

See the demo online at https://ngx-firebase-web-authn.web.app.
#### Exported methods
```ts
createUserWithPasskey: (auth: Auth, functions: Functions, displayName: string) => Promise<UserCredential>;
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
Add `.catch<void>((reason: any): void => console.error(reason))` to these methods for an error code that may point to one of your Firebase Functions. If the user cancels `createUserWithPasskey`, the method throws `"ngxFirebaseWebAuthn/createUserWithPasskey: Cancelled by user."`, for example.
