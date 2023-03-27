import { Auth }                                                                                                                                                                                                                                          from "@angular/fire/auth";
import { Functions, httpsCallableFromURL }                                                                                                                                                                                                               from "@angular/fire/functions";
import { ClearChallengeFunctionRequest, ClearChallengeFunctionResponse, CreateReauthenticationChallengeFunctionRequest, CreateReauthenticationChallengeFunctionResponse, VerifyReauthenticationFunctionRequest, VerifyReauthenticationFunctionResponse } from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                                                                                                                                                                                                           from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                                                                                                                                                                                                                    from "@simplewebauthn/typescript-types";


export const verifyUserWithPasskey: (auth: Auth, functions: Functions) => Promise<void> = async (auth: Auth, functions: Functions): Promise<void> => (async (createReauthenticationChallengeFunctionResponse: CreateReauthenticationChallengeFunctionResponse): Promise<void> => ("message" in createReauthenticationChallengeFunctionResponse && createReauthenticationChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createReauthenticationChallengeFunction: " + createReauthenticationChallengeFunctionResponse.message);
})() : (async (): Promise<void> => "requestOptions" in createReauthenticationChallengeFunctionResponse ? (async (authenticationResponse: AuthenticationResponseJSON): Promise<void> => (async (verifyReauthenticationFunctionResponse: VerifyReauthenticationFunctionResponse): Promise<void> => ("message" in verifyReauthenticationFunctionResponse && verifyReauthenticationFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/verifyReauthenticationFunction: " + verifyReauthenticationFunctionResponse.message);
})() : void(0))((await httpsCallableFromURL<VerifyReauthenticationFunctionRequest, VerifyReauthenticationFunctionResponse>(functions, "/ngxFirebaseWebAuthn/verifyReauthentication")({
  authenticationResponse: authenticationResponse,
})).data))(await startAuthentication(createReauthenticationChallengeFunctionResponse.requestOptions).catch<never>(async (_reason: any): Promise<never> => ((clearChallengeFunctionResponse: ClearChallengeFunctionResponse): never => ("message" in clearChallengeFunctionResponse && clearChallengeFunctionResponse.message) ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/clearChallengeFunction: " + clearChallengeFunctionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/signInWithPasskey: Cancelled by user.");
})())((await httpsCallableFromURL<ClearChallengeFunctionRequest, ClearChallengeFunctionResponse>(functions, "/ngxFirebaseWebAuthn/clearChallenge")()).data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/createReauthenticationChallengeFunction: Invalid response.");
})())())((await httpsCallableFromURL<CreateReauthenticationChallengeFunctionRequest, CreateReauthenticationChallengeFunctionResponse>(functions, "/ngxFirebaseWebAuthn/createReauthenticationChallenge")()).data);
