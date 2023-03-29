import { Auth }                                                 from "@angular/fire/auth";
import { Functions, httpsCallableFromURL, HttpsCallableResult } from "@angular/fire/functions";
import { FunctionRequest, FunctionResponse }                    from "@ngx-firebase-web-authn/functions";
import { startAuthentication }                                  from "@simplewebauthn/browser";
import { AuthenticationResponseJSON }                           from "@simplewebauthn/typescript-types";


export const verifyUserWithPasskey: (auth: Auth, functions: Functions) => Promise<void> = async (auth: Auth, functions: Functions): Promise<void> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "create reauthentication challenge",
}).then<void>(async (httpsCallableResult: HttpsCallableResult<FunctionResponse>): Promise<void> => ((functionResponse: FunctionResponse) => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : "requestOptions" in functionResponse ? startAuthentication(functionResponse.requestOptions).then<void>(async (authenticationResponse: AuthenticationResponseJSON): Promise<void> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  authenticationResponse: authenticationResponse,
  type: "verify reauthentication",
}).then<void>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): void => ((functionResponse: FunctionResponse) => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : void(0))(httpsCallableResult.data))).catch<never>(async (): Promise<never> => httpsCallableFromURL<FunctionRequest, FunctionResponse>(functions, "/ngxFirebaseWebAuthn")({
  type: "clear challenge",
}).then<never>((httpsCallableResult: HttpsCallableResult<FunctionResponse>): never => ((functionResponse: FunctionResponse): never => "message" in functionResponse && functionResponse.message ? ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": " + functionResponse.message);
})() : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/signInWithPasskey: Cancelled by user.");
})())(httpsCallableResult.data))) : ((): never => {
  throw new Error("ngxFirebaseWebAuthn/" + functionResponse.type + ": Invalid response.");
})())(httpsCallableResult.data));
