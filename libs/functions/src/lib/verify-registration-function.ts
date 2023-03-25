import { verifyRegistrationResponse }                  from "@simplewebauthn/server";
import { RegistrationResponseJSON }                    from "@simplewebauthn/typescript-types";
import { getAuth }                                     from "firebase-admin/auth";
import { DocumentReference, FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsFunction, runWith }                      from "firebase-functions";
import { FunctionResponseSuccessful }                  from "./function-response-successful";
import { FunctionResponseUnsuccessful }                from "./function-response-unsuccessful";
import { UserDocument }                                from "./user-document";


interface VerifyRegistrationFunctionResponseSuccessful extends FunctionResponseSuccessful {
  "customToken": string,
}
interface VerifyRegistrationFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message":  "Please create a registration challenge first." | "Please sign in anonymously first." | "Registration response not verified." | "This user doesn't exist.",
}

export interface VerifyRegistrationFunctionRequest {
  "registrationResponse": RegistrationResponseJSON,
}
export type VerifyRegistrationFunctionResponse = VerifyRegistrationFunctionResponseSuccessful | VerifyRegistrationFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnVerifyRegistration: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (verifyRegistrationFunctionRequest: VerifyRegistrationFunctionRequest, callableContext): Promise<VerifyRegistrationFunctionResponse> => callableContext.auth ? (async (auth, firestore): Promise<VerifyRegistrationFunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<VerifyRegistrationFunctionResponse> => userDocument ? (async (): Promise<VerifyRegistrationFunctionResponse> => userDocument.challenge ? (async (verifiedRegistrationResponse): Promise<VerifyRegistrationFunctionResponse> => verifiedRegistrationResponse.verified ? (async (_writeResult): Promise<VerifyRegistrationFunctionResponse> => ((customToken): VerifyRegistrationFunctionResponse => ({
    success: true,
    customToken: customToken,
  }))(await auth.createCustomToken(callableContext.auth!.uid)))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument | undefined>).update({
    challenge: FieldValue.delete(),
    credentialCounter: verifiedRegistrationResponse.registrationInfo!.counter,
    credentialId: verifiedRegistrationResponse.registrationInfo!.credentialID,
    credentialPublicKey: verifiedRegistrationResponse.registrationInfo!.credentialPublicKey,
  })) : ((_writeResult): VerifyRegistrationFunctionResponse => ({
    success: false,
    message: "Registration response not verified.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))(await verifyRegistrationResponse({
    expectedChallenge: userDocument["challenge"],
    expectedOrigin: "https://console.gavinsawyer.dev",
    expectedRPID: "console.gavinsawyer.dev",
    requireUserVerification: true,
    response: verifyRegistrationFunctionRequest.registrationResponse,
  })) : ((_writeResult): VerifyRegistrationFunctionResponse => ({
    success: false,
    message: "Please create a registration challenge first.",
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))() : {
    success: false,
    message: "This user doesn't exist.",
  })((await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).get()).data()))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in anonymously first.",
  });
