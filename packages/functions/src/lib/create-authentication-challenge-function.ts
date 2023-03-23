import { generateAuthenticationOptions }         from "@simplewebauthn/server";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import { getAuth }                               from "firebase-admin/auth";
import { DocumentReference, getFirestore }       from "firebase-admin/firestore";
import { HttpsFunction, runWith }                from "firebase-functions";
import { FunctionResponseSuccessful }            from "./function-response-successful";
import { FunctionResponseUnsuccessful }          from "./function-response-unsuccessful";
import { UserDocument }                          from "./user-document";


interface CreateAuthenticationChallengeFunctionResponseSuccessful extends FunctionResponseSuccessful {
  "requestOptions": PublicKeyCredentialRequestOptionsJSON,
}
interface CreateAuthenticationChallengeFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message": "Please sign in anonymously first.",
}

export interface CreateAuthenticationChallengeFunctionRequest {}
export type CreateAuthenticationChallengeFunctionResponse = CreateAuthenticationChallengeFunctionResponseSuccessful | CreateAuthenticationChallengeFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnCreateAuthenticationChallenge: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (createAuthenticationChallengeFunctionRequest: CreateAuthenticationChallengeFunctionRequest, callableContext): Promise<CreateAuthenticationChallengeFunctionResponse> => callableContext.auth ? ((auth, firestore): Promise<CreateAuthenticationChallengeFunctionResponse> => (async (publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptionsJSON): Promise<CreateAuthenticationChallengeFunctionResponse> => ((_writeResult): CreateAuthenticationChallengeFunctionResponse => ({
    success: true,
    requestOptions: publicKeyCredentialRequestOptions,
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).set({
    challenge: publicKeyCredentialRequestOptions.challenge,
  }, {
    merge: true,
  })))(generateAuthenticationOptions({
    rpID: "console.gavinsawyer.dev",
    userVerification: "required",
  })))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in anonymously first.",
  });
