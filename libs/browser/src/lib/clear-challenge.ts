import { Functions, httpsCallableFromURL, HttpsCallableResult } from "firebase/functions";
import { FunctionRequest, FunctionResponse }                    from "@ngx-firebase-web-authn/functions";
import { NgxFirebaseWebAuthnError }                             from "./ngx-firebase-web-authn-error";


export const clearChallenge: (functions: Functions) => Promise<never> = (functions: Functions) => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  operation: "clear challenge",
})
  .then<never>(({ data: functionResponse }: HttpsCallableResult<FunctionResponse>): never => "code" in functionResponse ? ((): never => {
    throw new NgxFirebaseWebAuthnError(functionResponse);
  })() : ((): never => {
    throw new NgxFirebaseWebAuthnError({
      code: "cancelled",
      message: "Cancelled by user.",
      operation: functionResponse.operation,
    });
  })())
  .catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "httpsCallableFromURL",
      operation: "clear challenge",
    });
  });
