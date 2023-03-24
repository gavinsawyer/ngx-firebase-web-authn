import { VerifiedAuthenticationResponse, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { AuthenticationResponseJSON }                                   from "@simplewebauthn/typescript-types";
import { getAuth }                                                      from "firebase-admin/auth";
import { DocumentReference, FieldValue, getFirestore }                  from "firebase-admin/firestore";
import { HttpsFunction, runWith }                                       from "firebase-functions";
import { FunctionResponseSuccessful }                                   from "./function-response-successful";
import { FunctionResponseUnsuccessful }                                 from "./function-response-unsuccessful";
import { UserDocument }                                                 from "./user-document";


interface VerifyReauthenticationFunctionResponseSuccessful extends FunctionResponseSuccessful {}
interface VerifyReauthenticationFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message": "A passkey doesn't exist for this user." | "Reauthentication response not verified." | "Please create a reauthentication challenge first." | "Please sign in first." | "The authenticator didn't provide a uid." | "This user doesn't exist.",
}

export interface VerifyReauthenticationFunctionRequest {
  "authenticationResponse": AuthenticationResponseJSON,
}
export type VerifyReauthenticationFunctionResponse = VerifyReauthenticationFunctionResponseSuccessful | VerifyReauthenticationFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnVerifyReauthentication: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (verifyReauthenticationFunctionRequest: VerifyReauthenticationFunctionRequest, callableContext): Promise<VerifyReauthenticationFunctionResponse> => callableContext.auth && callableContext.auth.uid === verifyReauthenticationFunctionRequest.authenticationResponse.response.userHandle ? (async (auth, firestore): Promise<VerifyReauthenticationFunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<VerifyReauthenticationFunctionResponse> => userDocument ? (async () => userDocument.credentialId && userDocument.credentialPublicKey ? (async () => userDocument.challenge ? (async (verifiedAuthenticationResponse: VerifiedAuthenticationResponse): Promise<VerifyReauthenticationFunctionResponse> => verifiedAuthenticationResponse.verified ? (async (_writeResult): Promise<VerifyReauthenticationFunctionResponse> => ({
    success: true,
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
    credentialCounter: verifiedAuthenticationResponse.authenticationInfo.newCounter,
    credentialId: verifiedAuthenticationResponse.authenticationInfo.credentialID,
  })) : ((_writeResult): VerifyReauthenticationFunctionResponse => ({
    success: false,
    message: "Reauthentication response not verified.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))(await verifyAuthenticationResponse({
    authenticator: {
      counter: userDocument.credentialCounter!,
      credentialID: userDocument.credentialId!,
      credentialPublicKey: userDocument.credentialPublicKey!,
    },
    expectedChallenge: userDocument.challenge,
    expectedOrigin: "https://console.gavinsawyer.dev",
    expectedRPID: "console.gavinsawyer.dev",
    requireUserVerification: true,
    response: verifyReauthenticationFunctionRequest.authenticationResponse,
  })) : {
    success: false,
    message: "Please create a reauthentication challenge first.",
  })() : ((_writeResult): VerifyReauthenticationFunctionResponse => ({
    success: false,
    message: "A passkey doesn't exist for this user.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))() : {
    success: false,
    message: "This user doesn't exist.",
  })((await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).get()).data()))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in first."
  });
