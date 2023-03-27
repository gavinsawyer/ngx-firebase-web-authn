import { Auth, signInAnonymously, signInWithCustomToken, User, UserCredential }                                                                                                                           from "@angular/fire/auth";
import { Functions, httpsCallableFromURL }                                                                                                                                                                from "@angular/fire/functions";
import { ClearChallengeFunctionResponse, CreateRegistrationChallengeFunctionRequest, CreateRegistrationChallengeFunctionResponse, VerifyRegistrationFunctionRequest, VerifyRegistrationFunctionResponse } from "@ngx-firebase-web-authn/functions";
import { startRegistration }                                                                                                                                                                              from "@simplewebauthn/browser";
import { RegistrationResponseJSON }                                                                                                                                                                       from "@simplewebauthn/typescript-types";


export const createUserWithPasskey: (auth: Auth, functions: Functions, name: string) => Promise<UserCredential> = async (auth: Auth, functions: Functions, name: string): Promise<UserCredential> => (async (_user: User): Promise<UserCredential> => (async (createRegistrationChallengeFunctionResponse: CreateRegistrationChallengeFunctionResponse): Promise<UserCredential> => ("message" in createRegistrationChallengeFunctionResponse && createRegistrationChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createRegistrationChallengeFunction: " + createRegistrationChallengeFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "creationOptions" in createRegistrationChallengeFunctionResponse ? (async (registrationResponse: RegistrationResponseJSON): Promise<UserCredential> => (async (verifyRegistrationFunctionResponse: VerifyRegistrationFunctionResponse): Promise<UserCredential> => ("message" in verifyRegistrationFunctionResponse && verifyRegistrationFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyRegistrationFunction: " + verifyRegistrationFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "customToken" in verifyRegistrationFunctionResponse ? await signInWithCustomToken(auth, verifyRegistrationFunctionResponse.customToken) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyRegistrationFunction: Invalid response.");
})())())((await httpsCallableFromURL<VerifyRegistrationFunctionRequest, VerifyRegistrationFunctionResponse>(functions, "/ngxFirebaseWebAuthn/verifyRegistration")({
  registrationResponse: registrationResponse,
})).data))(await startRegistration(createRegistrationChallengeFunctionResponse.creationOptions).catch<never>(async (_reason: any): Promise<never> => ((clearChallengeFunctionResponse: ClearChallengeFunctionResponse): never => ("message" in clearChallengeFunctionResponse && clearChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/clearChallengeFunction: " + clearChallengeFunctionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createUserWithPasskey: Cancelled by user.");
})())((await httpsCallableFromURL<null, ClearChallengeFunctionResponse>(functions, "/ngxFirebaseWebAuthn/clearChallenge")()).data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createRegistrationChallengeFunction: Invalid response.");
})())())((await httpsCallableFromURL<CreateRegistrationChallengeFunctionRequest, CreateRegistrationChallengeFunctionResponse>(functions, "/ngxFirebaseWebAuthn/createRegistrationChallenge")({
  name: name,
})).data))(auth.currentUser || (await signInAnonymously(auth)).user);
