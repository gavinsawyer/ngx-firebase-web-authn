import { Auth, signInAnonymously, signInWithCustomToken, User, UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult }                 from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                                    from "@ngx-firebase-web-authn/functions";
import { startRegistration }                                                    from "@simplewebauthn/browser";
import { RegistrationResponseJSON }                                             from "@simplewebauthn/typescript-types";


export const createUserWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential> = async (auth: Auth, functions: Functions, name: string): Promise<UserCredential> => ((_user: User): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  name: name,
  type: "create registration challenge",
}).then<UserCredential>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => ((functionResponse: FunctionResponse): Promise<UserCredential> => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : "creationOptions" in functionResponse ? startRegistration(functionResponse.creationOptions).then<UserCredential>((registrationResponse: RegistrationResponseJSON): Promise<UserCredential> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  registrationResponse: registrationResponse,
  type: "verify registration",
}).then<UserCredential>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<UserCredential> => ((functionResponse: FunctionResponse): Promise<UserCredential> => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : "customToken" in functionResponse ? signInWithCustomToken(auth, functionResponse.customToken) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": Invalid response.");
})())(httpsCallableResult.data))).catch<never>((): Promise<never> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "clear challenge",
}).then<never>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): never => ((functionResponse: FunctionResponse): never => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createUserWithPasskey: Cancelled by user.");
})())(httpsCallableResult.data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": Invalid response.");
})())(httpsCallableResult.data)))(auth.currentUser || (await signInAnonymously(auth)).user);
