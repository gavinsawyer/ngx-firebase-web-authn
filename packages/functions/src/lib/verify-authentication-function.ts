import { VerifiedAuthenticationResponse, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { AuthenticationResponseJSON }                                   from "@simplewebauthn/typescript-types";
import { getAuth }                                                      from "firebase-admin/auth";
import { DocumentReference, FieldValue, getFirestore }                  from "firebase-admin/firestore";
import { HttpsFunction, runWith }                                       from "firebase-functions";
import { FunctionResponseSuccessful }                                   from "./function-response-successful";
import { FunctionResponseUnsuccessful }                                 from "./function-response-unsuccessful";
import { UserDocument }                                                 from "./user-document";


interface VerifyAuthenticationFunctionResponseSuccessful extends FunctionResponseSuccessful {
  "customToken": string,
}
interface VerifyAuthenticationFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message": "A passkey doesn't exist for this user." | "Authentication response not verified." | "Please create an authentication challenge first." | "Please sign in anonymously first." | "The authenticator didn't provide a uid." | "This user doesn't exist." | "This user is already signed in.",
}

export interface VerifyAuthenticationFunctionRequest {
  "authenticationResponse": AuthenticationResponseJSON,
}
export type VerifyAuthenticationFunctionResponse = VerifyAuthenticationFunctionResponseSuccessful | VerifyAuthenticationFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnVerifyAuthentication: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (verifyAuthenticationFunctionRequest: VerifyAuthenticationFunctionRequest, callableContext): Promise<VerifyAuthenticationFunctionResponse> => callableContext.auth ? (async (auth, firestore): Promise<VerifyAuthenticationFunctionResponse> => verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle !== callableContext.auth!.uid ? (async (userDocument: UserDocument | undefined): Promise<VerifyAuthenticationFunctionResponse> => userDocument ? (async () => userDocument.credentialPublicKey ? (async (anonymousUserDocument: UserDocument | undefined) => anonymousUserDocument && anonymousUserDocument.challenge ? (async (verifiedAuthenticationResponse: VerifiedAuthenticationResponse): Promise<VerifyAuthenticationFunctionResponse> => verifiedAuthenticationResponse.verified ? (async (_writeResult): Promise<VerifyAuthenticationFunctionResponse> => (async (_writeResult): Promise<VerifyAuthenticationFunctionResponse> => (async (customToken): Promise<VerifyAuthenticationFunctionResponse> => ({
    success: true,
    customToken: customToken,
  }))(await auth.createCustomToken(verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle!)))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle!) as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
    credentialCounter: verifiedAuthenticationResponse.authenticationInfo.newCounter,
    credentialId: verifiedAuthenticationResponse.authenticationInfo.credentialID,
  })) : ((_writeResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "Authentication response not verified.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))(await verifyAuthenticationResponse({
    authenticator: {
      counter: userDocument.credentialCounter!,
      credentialID: userDocument.credentialId!,
      credentialPublicKey: userDocument.credentialPublicKey!,
    },
    expectedChallenge: anonymousUserDocument.challenge,
    expectedOrigin: "https://console.gavinsawyer.dev",
    expectedRPID: "console.gavinsawyer.dev",
    requireUserVerification: true,
    response: verifyAuthenticationFunctionRequest.authenticationResponse,
  })) : ((_writeResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "Please create an authentication challenge first.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))((await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).get()).data()) : ((_writeResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "A passkey doesn't exist for this user.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))() : ((_writeResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "This user doesn't exist.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))((await firestore.collection("ngxFirebaseWebAuthnUsers").doc(verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle!).get()).data()) : ((_writeResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "This user is already signed in.",
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  })))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in anonymously first."
  });
