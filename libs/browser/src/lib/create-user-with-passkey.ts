import { Auth, signInAnonymously, signInWithCustomToken, User, UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallableFromURL }                                      from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                                    from "@ngx-firebase-web-authn/functions";
import { startRegistration }                                                    from "@simplewebauthn/browser";
import { RegistrationResponseJSON }                                             from "@simplewebauthn/typescript-types";


export const createUserWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential> = async (auth: Auth, functions: Functions, name: string): Promise<UserCredential> => (async (_user: User): Promise<UserCredential> => (async (createRegistrationChallengeFunctionResponse: FunctionResponse): Promise<UserCredential> => ("message" in createRegistrationChallengeFunctionResponse && createRegistrationChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createRegistrationChallengeFunction: " + createRegistrationChallengeFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "creationOptions" in createRegistrationChallengeFunctionResponse ? (async (registrationResponse: RegistrationResponseJSON): Promise<UserCredential> => (async (verifyRegistrationFunctionResponse: FunctionResponse): Promise<UserCredential> => ("message" in verifyRegistrationFunctionResponse && verifyRegistrationFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyRegistrationFunction: " + verifyRegistrationFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "customToken" in verifyRegistrationFunctionResponse ? await signInWithCustomToken(auth, verifyRegistrationFunctionResponse.customToken) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyRegistrationFunction: Invalid response.");
})())())((await httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  registrationResponse: registrationResponse,
  type: "verify registration",
})).data))(await startRegistration(createRegistrationChallengeFunctionResponse.creationOptions).catch<never>(async (_reason: any): Promise<never> => ((clearChallengeFunctionResponse: FunctionResponse): never => ("message" in clearChallengeFunctionResponse && clearChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/clearChallengeFunction: " + clearChallengeFunctionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createUserWithPasskey: Cancelled by user.");
})())((await httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "clear challenge",
})).data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createRegistrationChallengeFunction: Invalid response.");
})())())((await httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  name: name,
  type: "create registration challenge",
})).data))(auth.currentUser || (await signInAnonymously(auth)).user);
