import { generateAuthenticationOptions }         from "@simplewebauthn/server";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import { getAuth }                               from "firebase-admin/auth";
import { DocumentReference, getFirestore }       from "firebase-admin/firestore";
import { HttpsFunction, runWith }                from "firebase-functions";
import { FunctionResponseSuccessful }            from "./function-response-successful";
import { FunctionResponseUnsuccessful }          from "./function-response-unsuccessful";
import { UserDocument }                          from "./user-document";


interface CreateReauthenticationChallengeFunctionResponseSuccessful extends FunctionResponseSuccessful {
  "requestOptions": PublicKeyCredentialRequestOptionsJSON,
}
interface CreateReauthenticationChallengeFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message": "A passkey doesn't exist for this user." | "Please sign in first." | "This user doesn't exist.",
}

export interface CreateReauthenticationChallengeFunctionRequest {}
export type CreateReauthenticationChallengeFunctionResponse = CreateReauthenticationChallengeFunctionResponseSuccessful | CreateReauthenticationChallengeFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnCreateReauthenticationChallenge: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (createReauthenticationChallengeFunctionRequest: CreateReauthenticationChallengeFunctionRequest, callableContext): Promise<CreateReauthenticationChallengeFunctionResponse> => callableContext.auth ? (async (auth, firestore): Promise<CreateReauthenticationChallengeFunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<CreateReauthenticationChallengeFunctionResponse> => userDocument ? (async (): Promise<CreateReauthenticationChallengeFunctionResponse> => userDocument.credentialId ? (async (publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptionsJSON): Promise<CreateReauthenticationChallengeFunctionResponse> => ((_writeResult): CreateReauthenticationChallengeFunctionResponse => ({
    success: true,
    requestOptions: publicKeyCredentialRequestOptions,
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).set({
    challenge: publicKeyCredentialRequestOptions.challenge,
  }, {
    merge: true,
  })))(generateAuthenticationOptions({
    allowCredentials: [
      {
        id: userDocument.credentialId,
        type: "public-key",
      },
    ],
    rpID: "console.gavinsawyer.dev",
    userVerification: "required",
  })) : {
    success: false,
    message: "A passkey doesn't exist for this user.",
  })() : {
    success: false,
    message: "This user doesn't exist.",
  })((await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).get()).data()))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in first.",
  });
