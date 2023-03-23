import { DocumentReference, FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsFunction, runWith }                      from "firebase-functions";
import { FunctionResponseSuccessful }                  from "./function-response-successful";
import { FunctionResponseUnsuccessful }                from "./function-response-unsuccessful";
import { UserDocument }                                from "./user-document";


interface ClearChallengeFunctionResponseSuccessful extends FunctionResponseSuccessful {}
interface ClearChallengeFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message": "Please sign in anonymously first." | "This user doesn't exist.",
}

export interface ClearChallengeFunctionRequest {}
export type ClearChallengeFunctionResponse = ClearChallengeFunctionResponseSuccessful | ClearChallengeFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnClearChallenge: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (_clearChallengeFunctionRequest: ClearChallengeFunctionRequest, callableContext): Promise<ClearChallengeFunctionResponse> => callableContext.auth ? (async (firestore): Promise<ClearChallengeFunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<ClearChallengeFunctionResponse> => userDocument ? (async (): Promise<ClearChallengeFunctionResponse> => userDocument.credentialPublicKey ? ((_writeResult): ClearChallengeFunctionResponse => ({
    success: true,
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  })) : ((_writeResult): ClearChallengeFunctionResponse => ({
    success: true,
  }))(await firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid).delete()))() : {
    success: false,
    message: "This user doesn't exist.",
  })((await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).get()).data()))(getFirestore()) : {
    success: false,
    message: "Please sign in anonymously first.",
  });
