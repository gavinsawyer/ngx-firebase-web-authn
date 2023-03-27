import { VerifiedAuthenticationResponse, verifyAuthenticationResponse }                   from "@simplewebauthn/server";
import { AuthenticationResponseJSON }                                                     from "@simplewebauthn/typescript-types";
import { Auth, getAuth }                                                                  from "firebase-admin/auth";
import { DocumentReference, FieldValue, Firestore, getFirestore, Timestamp, WriteResult } from "firebase-admin/firestore";
import { HttpsFunction, runWith }                                                         from "firebase-functions";
import { FunctionResponseSuccessful }                                                     from "./function-response-successful";
import { FunctionResponseUnsuccessful }                                                   from "./function-response-unsuccessful";
import { UserDocument }                                                                   from "./user-document";


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
  .onCall(async (verifyAuthenticationFunctionRequest: VerifyAuthenticationFunctionRequest, callableContext): Promise<VerifyAuthenticationFunctionResponse> => callableContext.auth ? (async (auth: Auth, firestore: Firestore): Promise<VerifyAuthenticationFunctionResponse> => verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle !== callableContext.auth!.uid ? (async (userDocument: UserDocument | undefined): Promise<VerifyAuthenticationFunctionResponse> => userDocument ? (async () => userDocument.credentialId && userDocument.credentialPublicKey ? (async (anonymousUserDocument: UserDocument | undefined) => anonymousUserDocument && anonymousUserDocument.challenge ? (async (verifiedAuthenticationResponse: VerifiedAuthenticationResponse): Promise<VerifyAuthenticationFunctionResponse> => verifiedAuthenticationResponse.verified ? (async (_writeResult: WriteResult): Promise<VerifyAuthenticationFunctionResponse> => (async (_writeResult: WriteResult): Promise<VerifyAuthenticationFunctionResponse> => (async (customToken: string): Promise<VerifyAuthenticationFunctionResponse> => ({
    success: true,
    customToken: customToken,
  }))(await auth.createCustomToken(verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle!)))(anonymousUserDocument.credentialId && anonymousUserDocument.credentialPublicKey ? await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).update({
    challenge: FieldValue.delete(),
  }) : await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle!) as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
    credentialCounter: verifiedAuthenticationResponse.authenticationInfo.newCounter,
    credentialId: verifiedAuthenticationResponse.authenticationInfo.credentialID,
    lastVerified: Timestamp.fromDate(new Date()),
  })) : ((_writeResult: WriteResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "Authentication response not verified.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))(await verifyAuthenticationResponse({
    authenticator: {
      counter: userDocument.credentialCounter!,
      credentialID: userDocument.credentialId!,
      credentialPublicKey: userDocument.credentialPublicKey!,
    },
    expectedChallenge: anonymousUserDocument.challenge,
    expectedOrigin: "https://" + callableContext.rawRequest.hostname,
    expectedRPID: callableContext.rawRequest.hostname,
    requireUserVerification: true,
    response: verifyAuthenticationFunctionRequest.authenticationResponse,
  })) : ((_writeResult: WriteResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "Please create an authentication challenge first.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))((await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).get()).data()) : ((_writeResult: WriteResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "A passkey doesn't exist for this user.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))() : ((_writeResult: WriteResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "This user doesn't exist.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))((await firestore.collection("ngxFirebaseWebAuthnUsers").doc(verifyAuthenticationFunctionRequest.authenticationResponse.response.userHandle!).get()).data()) : ((_writeResult: WriteResult): VerifyAuthenticationFunctionResponse => ({
    success: false,
    message: "This user is already signed in.",
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  })))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in anonymously first."
  });
