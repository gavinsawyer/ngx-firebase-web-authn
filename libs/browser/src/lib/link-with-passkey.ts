import { Auth, UserCredential }                                 from "@angular/fire/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult } from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                    from "@ngx-firebase-web-authn/functions";
import { startRegistration }                                    from "@simplewebauthn/browser";
import { RegistrationResponseJSON }                             from "@simplewebauthn/typescript-types";
import { clearChallenge }                                       from "./clear-challenge";
import { handleVerifyFunctionResponse }                         from "./handle-verify-function-response";
import { NgxFirebaseWebAuthnError }                             from "./ngx-firebase-web-authn-error";


export const linkWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential> = (auth: Auth, functions: Functions, name: string): Promise<UserCredential> => auth
  .currentUser ? httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
    name: name,
    operation: "create registration challenge",
  })
  .then<UserCredential>(({ data: functionResponse }: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => "code" in functionResponse ? ((): never => {
    throw new NgxFirebaseWebAuthnError(functionResponse);
  })() : "creationOptions" in functionResponse ? startRegistration(functionResponse.creationOptions).then<UserCredential>((registrationResponse: RegistrationResponseJSON): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
    registrationResponse: registrationResponse,
    operation: "verify registration",
  }).then<UserCredential>(({ data: functionResponse }: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => handleVerifyFunctionResponse(auth, functionResponse)).catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "httpsCallableFromURL",
      operation: "verify registration",
    });
  })).catch<never>((): Promise<never> => clearChallenge(functions)) : ((): never => {
    throw new NgxFirebaseWebAuthnError({
      code: "invalid",
      message: "Invalid function response.",
      operation: functionResponse.operation,
    });
  })())
  .catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "httpsCallableFromURL",
      operation: "create registration challenge",
    });
  }) : ((): never => {
    throw new NgxFirebaseWebAuthnError({
      code: "missing-auth",
      message: "No user is signed in.",
      operation: "create reauthentication challenge",
    });
  })();
