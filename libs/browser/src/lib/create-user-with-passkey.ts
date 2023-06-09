import { Auth, signInAnonymously, UserCredential } from "firebase/auth";
import { Functions }                               from "firebase/functions";
import { linkWithPasskey }                         from "./link-with-passkey";
import { NgxFirebaseWebAuthnError }                from "./ngx-firebase-web-authn-error";


export const createUserWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential> = (auth: Auth, functions: Functions, name: string): Promise<UserCredential> => auth
  .currentUser && auth
  .currentUser
  .isAnonymous ? linkWithPasskey(auth, functions, name) : signInAnonymously(auth)
  .then<UserCredential>((): Promise<UserCredential> => linkWithPasskey(auth, functions, name))
  .catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "signInAnonymously",
    });
  });
