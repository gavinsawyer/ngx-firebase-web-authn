import { Auth, signInAnonymously, signInWithCustomToken, User, UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallableFromURL }                                      from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                                    from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                                  from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                                           from "@simplewebauthn/typescript-types";


export const signInWithPasskey: (auth: Auth, functions: Functions) => Promise<UserCredential> = async (auth: Auth, functions: Functions): Promise<UserCredential> => (async (_user: User): Promise<UserCredential> => (async (createAuthenticationChallengeFunctionResponse: FunctionResponse): Promise<UserCredential> => ("message" in createAuthenticationChallengeFunctionResponse && createAuthenticationChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createAuthenticationChallengeFunction: " + createAuthenticationChallengeFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "requestOptions" in createAuthenticationChallengeFunctionResponse ? (async (authenticationResponse: AuthenticationResponseJSON): Promise<UserCredential> => (async (verifyAuthenticationFunctionResponse: FunctionResponse): Promise<UserCredential> => ("message" in verifyAuthenticationFunctionResponse && verifyAuthenticationFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyAuthenticationFunction: " + verifyAuthenticationFunctionResponse.message);
})() : (async (): Promise<UserCredential> => "customToken" in verifyAuthenticationFunctionResponse ? await signInWithCustomToken(auth, verifyAuthenticationFunctionResponse.customToken) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyAuthenticationFunction: Invalid response.");
})())())((await httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  authenticationResponse: authenticationResponse,
  type: "verify authentication",
})).data))(await startAuthentication(createAuthenticationChallengeFunctionResponse.requestOptions).catch<never>(async (_reason: any): Promise<never> => ((clearChallengeFunctionResponse: FunctionResponse): never => ("message" in clearChallengeFunctionResponse && clearChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/clearChallengeFunction: " + clearChallengeFunctionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/signInWithPasskey: Cancelled by user.");
})())((await httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "clear challenge",
})).data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createAuthenticationChallengeFunction: Invalid response.");
})())())((await httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "create authentication challenge",
})).data))(auth.currentUser || (await signInAnonymously(auth)).user);
