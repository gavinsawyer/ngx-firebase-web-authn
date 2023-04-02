import { Auth }                                                 from "firebase/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult } from "firebase/functions";
import { FunctionRequest, FunctionResponse }                    from "@ngx-firebase-web-authn/functions";
import { NgxFirebaseWebAuthnError }                             from "./ngx-firebase-web-authn-error";


export const unlinkPasskey: (auth: Auth, functions: Functions) => Promise<void> = (auth: Auth, functions: Functions): Promise<void> => auth
  .currentUser ? httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
    operation: "clear user doc",
  })
  .then<void>(({ data: functionResponse }: HttpsCallableResult<FunctionResponse>): void => "code" in functionResponse ? ((): never => {
    throw new NgxFirebaseWebAuthnError(functionResponse);
  })() : void(0))
  .catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "httpsCallableFromURL",
      operation: "clear challenge",
    });
  }) : ((): never => {
    throw new NgxFirebaseWebAuthnError({
      code: "missing-auth",
      message: "No user is signed in.",
      operation: "create reauthentication challenge",
    });
  })();
