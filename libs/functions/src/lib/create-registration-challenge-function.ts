import { generateRegistrationOptions }                             from "@simplewebauthn/server";
import { PublicKeyCredentialCreationOptionsJSON }                  from "@simplewebauthn/typescript-types";
import { Auth, getAuth }                                           from "firebase-admin/auth";
import { DocumentReference, Firestore, getFirestore, WriteResult } from "firebase-admin/firestore";
import { HttpsFunction, runWith }                                  from "firebase-functions";
import { FunctionResponseSuccessful }                              from "./function-response-successful";
import { FunctionResponseUnsuccessful }                            from "./function-response-unsuccessful";
import { UserDocument }                                            from "./user-document";


interface CreateRegistrationChallengeFunctionResponseSuccessful extends FunctionResponseSuccessful {
  "creationOptions": PublicKeyCredentialCreationOptionsJSON,
}
interface CreateRegistrationChallengeFunctionResponseUnsuccessful extends FunctionResponseUnsuccessful {
  "message": "Please sign in anonymously first." | "A passkey already exists for this user.",
}

export interface CreateRegistrationChallengeFunctionRequest {
  "name": string,
}
export type CreateRegistrationChallengeFunctionResponse = CreateRegistrationChallengeFunctionResponseSuccessful | CreateRegistrationChallengeFunctionResponseUnsuccessful;

export const ngxFirebaseWebAuthnCreateRegistrationChallenge: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (createRegistrationChallengeFunctionRequest: CreateRegistrationChallengeFunctionRequest, callableContext): Promise<CreateRegistrationChallengeFunctionResponse> => callableContext.auth ? (async (auth: Auth, firestore: Firestore): Promise<CreateRegistrationChallengeFunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<CreateRegistrationChallengeFunctionResponse> => !userDocument?.credentialPublicKey ? (async (publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptionsJSON): Promise<CreateRegistrationChallengeFunctionResponse> => ((_writeResult: WriteResult): CreateRegistrationChallengeFunctionResponse => ({
    success: true,
    creationOptions: publicKeyCredentialCreationOptions,
  }))(await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).set({
    challenge: publicKeyCredentialCreationOptions.challenge,
  })))(generateRegistrationOptions({
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
    rpID: callableContext.rawRequest.hostname,
    rpName: callableContext.rawRequest.hostname,
    userID: callableContext.auth!.uid,
    userName: createRegistrationChallengeFunctionRequest.name,
  })) : {
    success: false,
    message: "A passkey already exists for this user.",
  })((await (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth!.uid) as DocumentReference<UserDocument>).get()).data()))(getAuth(), getFirestore()) : {
    success: false,
    message: "Please sign in anonymously first.",
  });
