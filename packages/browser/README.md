## @ngx-firebase-web-authn/browser
An Angular Firebase extension for authentication with WebAuthn passkeys.

#### Exported methods
For the moment these should only be used when a user is not signed in or is signed in anonymously. Users are signed in anonymously first, which may make data disappear before the passkey window appears and is completed.

Also note that `displayName` is not stored except in the passkey, and can be changed by the user. Once users are signed in, your app should create an entry in a separate `users`/`profiles` collection to store user information

```ts
createUserWithPasskey: (auth: Auth, functions: Functions, displayName: string) => Promise<UserCredential>;
signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential>;
```
Designed to be used just like native Firebase Authentication providers:
```ts
import { CommonModule }         from "@angular/common";
import { Component }            from "@angular/core";
import { Auth, UserCredential } from "@angular/fire/auth";
import { Functions }            from "@angular/fire/functions";

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
