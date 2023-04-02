import { Auth }                                                 from "firebase/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult } from "firebase/functions";
import { FunctionRequest, FunctionResponse }                    from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                  from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                           from "@simplewebauthn/typescript-types";
import { clearChallenge }                                       from "./clear-challenge";
import { handleVerifyFunctionResponse }                         from "./handle-verify-function-response";
import { NgxFirebaseWebAuthnError }                             from "./ngx-firebase-web-authn-error";


export const verifyUserWithPasskey: (auth: Auth, functions: Functions) => Promise<void> = (auth: Auth, functions: Functions): Promise<void> => auth
  .currentUser ? httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
    operation: "create reauthentication challenge",
  })
  .then<void>(async ({ data: functionResponse }: HttpsCallableResult<FunctionResponse>): Promise<void> => "code" in functionResponse ? ((): never => {
    throw new NgxFirebaseWebAuthnError(functionResponse);
  })() : "requestOptions" in functionResponse ? startAuthentication(functionResponse.requestOptions).then<void>((authenticationResponse: AuthenticationResponseJSON): Promise<void> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
    authenticationResponse: authenticationResponse,
    operation: "verify reauthentication",
  }).then<void>(({ data: functionResponse }: HttpsCallableResult<FunctionResponse>): Promise<void> => handleVerifyFunctionResponse(auth, functionResponse).then<void>((): void => void(0))).catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "httpsCallableFromURL",
      operation: "verify reauthentication",
    });
  })).catch<never>(async (): Promise<never> => clearChallenge(functions)) : ((): never => {
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
      operation: "create reauthentication challenge",
    });
  }) : ((): never => {
    throw new NgxFirebaseWebAuthnError({
      code: "missing-auth",
      message: "No user is signed in.",
      operation: "create reauthentication challenge",
    });
  })();
