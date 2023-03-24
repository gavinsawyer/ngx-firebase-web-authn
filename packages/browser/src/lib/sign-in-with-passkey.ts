import { Auth, signInAnonymously, signInWithCustomToken, UserCredential }                                                                                                                                                                        from "@angular/fire/auth";
import { Functions, httpsCallableFromURL }                                                                                                                                                                                                       from "@angular/fire/functions";
import { ClearChallengeFunctionRequest, ClearChallengeFunctionResponse, CreateAuthenticationChallengeFunctionRequest, CreateAuthenticationChallengeFunctionResponse, VerifyAuthenticationFunctionRequest, VerifyAuthenticationFunctionResponse } from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                                                                                                                                                                                                   from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                                                                                                                                                                                                            from "@simplewebauthn/typescript-types";


export const signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential> = async (auth: Auth, functions: Functions): Promise<UserCredential> => (async (_userCredential: UserCredential): Promise<UserCredential> => (async (createAuthenticationChallengeFunctionResponse: CreateAuthenticationChallengeFunctionResponse): Promise<UserCredential | never> => ("message" in createAuthenticationChallengeFunctionResponse && createAuthenticationChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createAuthenticationChallengeFunction: " + createAuthenticationChallengeFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "requestOptions" in createAuthenticationChallengeFunctionResponse ? (async (authenticationResponse: AuthenticationResponseJSON): Promise<UserCredential> => (async (verifyAuthenticationFunctionResponse: VerifyAuthenticationFunctionResponse): Promise<UserCredential> => ("message" in verifyAuthenticationFunctionResponse && verifyAuthenticationFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyAuthenticationFunction: " + verifyAuthenticationFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "customToken" in verifyAuthenticationFunctionResponse ? await signInWithCustomToken(auth, verifyAuthenticationFunctionResponse.customToken) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyAuthenticationFunction: Invalid response.");
})())())((await httpsCallableFromURL<VerifyAuthenticationFunctionRequest, VerifyAuthenticationFunctionResponse>(functions, "/ngxFirebaseWebAuthn/verifyAuthentication")({
  authenticationResponse: authenticationResponse,
})).data))(await startAuthentication(createAuthenticationChallengeFunctionResponse.requestOptions).catch<never>(async (_reason: any): Promise<never> => ((clearChallengeFunctionResponse: ClearChallengeFunctionResponse): never => ("message" in clearChallengeFunctionResponse && clearChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/clearChallengeFunction: " + clearChallengeFunctionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/signInWithPasskey: Cancelled by user.");
})())((await httpsCallableFromURL<ClearChallengeFunctionRequest, ClearChallengeFunctionResponse>(functions, "/ngxFirebaseWebAuthn/clearChallenge")()).data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createAuthenticationChallengeFunction: Invalid response.");
})())())((await httpsCallableFromURL<CreateAuthenticationChallengeFunctionRequest, CreateAuthenticationChallengeFunctionResponse>(functions, "/ngxFirebaseWebAuthn/createAuthenticationChallenge")()).data))(await signInAnonymously(auth));
