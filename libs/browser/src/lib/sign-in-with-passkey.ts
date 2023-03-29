import { Auth, signInAnonymously, signInWithCustomToken, User, UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult }                 from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                                    from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                                  from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                                           from "@simplewebauthn/typescript-types";


export const signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential> = async (auth: Auth, functions: Functions): Promise<UserCredential> => ((_user: User): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "create authentication challenge",
}).then<UserCredential>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => ((functionResponse: FunctionResponse): Promise<UserCredential> => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : "requestOptions" in functionResponse ? startAuthentication(functionResponse.requestOptions).then<UserCredential>((authenticationResponse: AuthenticationResponseJSON): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  authenticationResponse: authenticationResponse,
  type: "verify authentication",
}).then<UserCredential>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => ((functionResponse: FunctionResponse): Promise<UserCredential> => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : "customToken" in functionResponse ? signInWithCustomToken(auth, functionResponse.customToken) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": Invalid response.");
})())(httpsCallableResult.data))).catch<never>((): Promise<never> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "clear challenge",
}).then<never>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): never => ((functionResponse: FunctionResponse): never => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/signInWithPasskey: Cancelled by user.");
})())(httpsCallableResult.data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": Invalid response.");
})())(httpsCallableResult.data)))(auth.currentUser || (await signInAnonymously(auth)).user);
