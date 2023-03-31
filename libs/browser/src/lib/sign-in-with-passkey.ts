import { Auth, signInAnonymously, signInWithCustomToken, UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult }           from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                              from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                            from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                                     from "@simplewebauthn/typescript-types";
import { NgxFirebaseWebAuthnError }                                       from "./ngx-firebase-web-authn-error";


export const signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential> = (auth: Auth, functions: Functions): Promise<UserCredential> => ((handler: () => Promise<UserCredential>): Promise<UserCredential> => auth.currentUser ? handler() : signInAnonymously(auth).then<UserCredential>((): Promise<UserCredential> => handler()))((): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  operation: "create authentication challenge",
}).then<UserCredential>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => ((functionResponse: FunctionResponse): Promise<UserCredential> => "code" in functionResponse && functionResponse.code ? ((): never => {
  throw new NgxFirebaseWebAuthnError(functionResponse);
})() : "requestOptions" in functionResponse ? startAuthentication(functionResponse.requestOptions).then<UserCredential>((authenticationResponse: AuthenticationResponseJSON): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  authenticationResponse: authenticationResponse,
  operation: "verify authentication",
}).then<UserCredential>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => ((functionResponse: FunctionResponse): Promise<UserCredential> => "code" in functionResponse && functionResponse.code ? ((): never => {
  throw new NgxFirebaseWebAuthnError(functionResponse);
})() : "customToken" in functionResponse ? signInWithCustomToken(auth, functionResponse.customToken).catch<never>((firebaseError): never => {
  throw new NgxFirebaseWebAuthnError({
    code: firebaseError.code,
    message: firebaseError.message,
    operation: functionResponse.operation,
  })
}) : ((): never => {
  throw new NgxFirebaseWebAuthnError({
    code: "invalid",
    message: "Invalid function response.",
    operation: functionResponse.operation,
  });
})())(httpsCallableResult.data)).catch<never>((firebaseError): never => {
  throw new NgxFirebaseWebAuthnError({
    code: firebaseError.code,
    message: firebaseError.message,
    operation: "verify authentication",
  })
})).catch<never>((): Promise<never> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  operation: "clear challenge",
}).then<never>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): never => ((functionResponse: FunctionResponse): never => "code" in functionResponse && functionResponse.code ? ((): never => {
  throw new NgxFirebaseWebAuthnError(functionResponse);
})() : ((): never => {
  throw new NgxFirebaseWebAuthnError({
    code: "cancelled",
    message: "Cancelled by user.",
    operation: functionResponse.operation,
  });
})())(httpsCallableResult.data)).catch<never>((firebaseError): never => {
  throw new NgxFirebaseWebAuthnError({
    code: firebaseError.code,
    message: firebaseError.message,
    operation: "clear challenge",
  })
})) : ((): never => {
  throw new NgxFirebaseWebAuthnError({
    code: "invalid",
    message: "Invalid function response.",
    operation: functionResponse.operation,
  });
})())(httpsCallableResult.data)).catch<never>((firebaseError): never => {
  throw new NgxFirebaseWebAuthnError({
    code: firebaseError.code,
    message: firebaseError.message,
    operation: "create authentication challenge",
  })
}));
