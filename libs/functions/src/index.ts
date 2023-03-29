import { generateAuthenticationOptions, generateRegistrationOptions, VerifiedAuthenticationResponse, verifyAuthenticationResponse, VerifiedRegistrationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON }                                                from "@simplewebauthn/typescript-types";
import { Auth, getAuth }                                                                                                                                                                      from "firebase-admin/auth";
import { DocumentReference, DocumentSnapshot, FieldValue, Firestore, getFirestore, Timestamp }                                                                                                from "firebase-admin/firestore";
import { HttpsFunction, runWith }                                                                                                                                                             from "firebase-functions";
import { CallableContext }                                                                                                                                                                    from "firebase-functions/lib/common/providers/https";


interface ClearChallengeFunctionRequest extends UnknownFunctionRequest {
  "type": "clear challenge",
}
interface ClearChallengeFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "type": "clear challenge",
}
interface ClearChallengeFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth" | "missing user doc" | "no action",
  "type": "clear challenge",
}
interface CreateAuthenticationChallengeFunctionRequest extends UnknownFunctionRequest {
  "type": "create authentication challenge",
}
interface CreateAuthenticationChallengeFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "requestOptions": PublicKeyCredentialRequestOptionsJSON,
  "type": "create authentication challenge",
}
interface CreateAuthenticationChallengeFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth",
  "type": "create authentication challenge",
}
interface CreateReauthenticationChallengeFunctionRequest extends UnknownFunctionRequest {
  "type": "create reauthentication challenge",
}
interface CreateReauthenticationChallengeFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "requestOptions": PublicKeyCredentialRequestOptionsJSON,
  "type": "create reauthentication challenge",
}
interface CreateReauthenticationChallengeFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth" | "missing user doc" | "user doc missing passkey fields",
  "type": "create reauthentication challenge",
}
interface CreateRegistrationChallengeFunctionRequest extends UnknownFunctionRequest {
  "name": string,
  "type": "create registration challenge",
}
interface CreateRegistrationChallengeFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "creationOptions": PublicKeyCredentialCreationOptionsJSON,
  "type": "create registration challenge",
}
interface CreateRegistrationChallengeFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth" | "no action",
  "type": "create registration challenge",
}
interface UnknownFunctionRequest {
  "type": "clear challenge" | "create authentication challenge" | "create reauthentication challenge" | "create registration challenge" | "verify authentication" | "verify reauthentication" | "verify registration",
}
interface UnknownFunctionResponse {
  "success": boolean,
  "type": "clear challenge" | "create authentication challenge" | "create reauthentication challenge" | "create registration challenge" | "verify authentication" | "verify reauthentication" | "verify registration",
}
interface UnknownFunctionResponseSuccessful extends UnknownFunctionResponse {
  "success": true,
}
interface UnknownFunctionResponseUnsuccessful extends UnknownFunctionResponse {
  "message": "missing auth" | "missing user doc" | "no action" | "not verified" | "user doc missing challenge field" | "user doc missing passkey fields",
  "success": false,
}
interface UserDocument {
  "challenge"?: string,
  "credentialCounter"?: number,
  "credentialId"?: Uint8Array,
  "credentialPublicKey"?: Uint8Array,
  "lastVerified"?: Timestamp,
}
interface VerifyAuthenticationFunctionRequest extends UnknownFunctionRequest {
  "authenticationResponse": AuthenticationResponseJSON,
  "type": "verify authentication",
}
interface VerifyAuthenticationFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "customToken": string,
  "type": "verify authentication",
}
interface VerifyAuthenticationFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth" | "missing user doc" | "no action" | "not verified" | "user doc missing challenge field" | "user doc missing passkey fields",
  "type": "verify authentication",
}
interface VerifyReauthenticationFunctionRequest extends UnknownFunctionRequest {
  "authenticationResponse": AuthenticationResponseJSON,
  "type": "verify reauthentication",
}
interface VerifyReauthenticationFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "customToken": string,
  "type": "verify reauthentication",
}
interface VerifyReauthenticationFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth" | "missing user doc" | "not verified" | "user doc missing challenge field" | "user doc missing passkey fields",
  "type": "verify reauthentication",
}
interface VerifyRegistrationFunctionRequest extends UnknownFunctionRequest {
  "registrationResponse": RegistrationResponseJSON,
  "type": "verify registration",
}
interface VerifyRegistrationFunctionResponseSuccessful extends UnknownFunctionResponseSuccessful {
  "customToken": string,
  "type": "verify registration",
}
interface VerifyRegistrationFunctionResponseUnsuccessful extends UnknownFunctionResponseUnsuccessful {
  "message": "missing auth" | "missing user doc" | "not verified" | "user doc missing challenge field",
  "type": "verify registration",
}

type ClearChallengeFunctionResponse = ClearChallengeFunctionResponseSuccessful | ClearChallengeFunctionResponseUnsuccessful;
type CreateAuthenticationChallengeFunctionResponse = CreateAuthenticationChallengeFunctionResponseSuccessful | CreateAuthenticationChallengeFunctionResponseUnsuccessful;
type CreateReauthenticationChallengeFunctionResponse = CreateReauthenticationChallengeFunctionResponseSuccessful | CreateReauthenticationChallengeFunctionResponseUnsuccessful;
type CreateRegistrationChallengeFunctionResponse = CreateRegistrationChallengeFunctionResponseSuccessful | CreateRegistrationChallengeFunctionResponseUnsuccessful;
type VerifyAuthenticationFunctionResponse = VerifyAuthenticationFunctionResponseSuccessful | VerifyAuthenticationFunctionResponseUnsuccessful;
type VerifyReauthenticationFunctionResponse = VerifyReauthenticationFunctionResponseSuccessful | VerifyReauthenticationFunctionResponseUnsuccessful;
type VerifyRegistrationFunctionResponse = VerifyRegistrationFunctionResponseSuccessful | VerifyRegistrationFunctionResponseUnsuccessful;

export type FunctionRequest = ClearChallengeFunctionRequest | CreateAuthenticationChallengeFunctionRequest | CreateReauthenticationChallengeFunctionRequest | CreateRegistrationChallengeFunctionRequest | VerifyAuthenticationFunctionRequest | VerifyReauthenticationFunctionRequest | VerifyRegistrationFunctionRequest;
export type FunctionResponse = ClearChallengeFunctionResponse | CreateAuthenticationChallengeFunctionResponse | CreateReauthenticationChallengeFunctionResponse | CreateRegistrationChallengeFunctionResponse | VerifyAuthenticationFunctionResponse | VerifyReauthenticationFunctionResponse | VerifyRegistrationFunctionResponse;

export const ngxFirebaseWebAuthn: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onCall(async (functionRequest: FunctionRequest, callableContext: CallableContext): Promise<FunctionResponse> => callableContext.auth ? ((auth: Auth, firestore: Firestore): Promise<FunctionResponse> => functionRequest.type === "clear challenge" ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid) as DocumentReference<UserDocument>).get().then<FunctionResponse>((userDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<FunctionResponse> => userDocument ? userDocument.challenge ? userDocument.credentialId && userDocument.credentialPublicKey ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  }).then<FunctionResponse>((): FunctionResponse => ({
    success: true,
    type: functionRequest.type,
  })) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    success: true,
    type: functionRequest.type,
  })) : {
    success: false,
    type: functionRequest.type,
    message: "no action",
  } : {
    message: "missing user doc",
    success: false,
    type: functionRequest.type,
  })(userDocumentSnapshot.data())) : functionRequest.type === "create authentication challenge" ? (async (publicKeyCredentialRequestOptionsJSON: PublicKeyCredentialRequestOptionsJSON): Promise<FunctionResponse> => (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).set({
    challenge: publicKeyCredentialRequestOptionsJSON.challenge,
  }, {
    merge: true,
  }).then<FunctionResponse>((): FunctionResponse => ({
    requestOptions: publicKeyCredentialRequestOptionsJSON,
    success: true,
    type: functionRequest.type,
  })))(generateAuthenticationOptions({
    rpID: callableContext.rawRequest.hostname,
    userVerification: "required",
  })) : functionRequest.type === "create reauthentication challenge" ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid) as DocumentReference<UserDocument>).get().then<FunctionResponse>(async (userDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<FunctionResponse> => userDocument ? userDocument.credentialId && userDocument.credentialPublicKey ? (async (publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptionsJSON): Promise<FunctionResponse> => (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).set({
    challenge: publicKeyCredentialRequestOptions.challenge,
  }, {
    merge: true,
  }).then<FunctionResponse>((): FunctionResponse => ({
    requestOptions: publicKeyCredentialRequestOptions,
    success: true,
    type: functionRequest.type,
  })))(generateAuthenticationOptions({
    allowCredentials: [
      {
        id: userDocument.credentialId,
        type: "public-key",
      },
    ],
    rpID: callableContext.rawRequest.hostname,
    userVerification: "required",
  })) : {
    message: "user doc missing passkey fields",
    success: false,
    type: functionRequest.type,
  } : {
    message: "missing user doc",
    success: false,
    type: functionRequest.type,
  })(userDocumentSnapshot.data())) : functionRequest.type === "create registration challenge" ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid) as DocumentReference<UserDocument>).get().then<FunctionResponse>(async (userDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<FunctionResponse> => !userDocument?.credentialPublicKey ? (async (publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptionsJSON): Promise<FunctionResponse> => (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).set({
    challenge: publicKeyCredentialCreationOptions.challenge,
  }).then<FunctionResponse>((): FunctionResponse => ({
    creationOptions: publicKeyCredentialCreationOptions,
    success: true,
    type: functionRequest.type,
  })))(generateRegistrationOptions({
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
    rpID: callableContext.rawRequest.hostname,
    rpName: callableContext.rawRequest.hostname,
    userID: callableContext.auth?.uid || "",
    userName: functionRequest.name,
  })) : {
    message: "no action",
    success: false,
    type: functionRequest.type,
  })(userDocumentSnapshot.data())) : functionRequest.type === "verify authentication" ? functionRequest.authenticationResponse.response.userHandle !== callableContext.auth?.uid ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(functionRequest.authenticationResponse.response.userHandle || "") as DocumentReference<UserDocument>).get().then<FunctionResponse>(async (userDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (userDocument: UserDocument | undefined) => userDocument ? userDocument.credentialId && userDocument.credentialPublicKey ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).get().then(async (anonymousUserDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (anonymousUserDocument: UserDocument | undefined): Promise<FunctionResponse> => anonymousUserDocument && anonymousUserDocument.challenge ? verifyAuthenticationResponse({
    authenticator: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      counter: userDocument.credentialCounter!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      credentialID: userDocument.credentialId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      credentialPublicKey: userDocument.credentialPublicKey!,
    },
    expectedChallenge: anonymousUserDocument.challenge,
    expectedOrigin: "https://" + callableContext.rawRequest.hostname,
    expectedRPID: callableContext.rawRequest.hostname,
    requireUserVerification: true,
    response: functionRequest.authenticationResponse,
  }).then<FunctionResponse>(async (verifiedAuthenticationResponse: VerifiedAuthenticationResponse): Promise<FunctionResponse> => verifiedAuthenticationResponse.verified ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(functionRequest.authenticationResponse.response.userHandle || "") as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
    lastVerified: Timestamp.fromDate(new Date()),
  }).then<FunctionResponse>(async (): Promise<FunctionResponse> => anonymousUserDocument.credentialId && anonymousUserDocument.credentialPublicKey ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  }).then<FunctionResponse>(async (): Promise<FunctionResponse> => auth.createCustomToken(functionRequest.authenticationResponse.response.userHandle || "").then<FunctionResponse>((customToken: string): FunctionResponse => ({
    customToken: customToken,
    success: true,
    type: functionRequest.type,
  }))) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>(async (): Promise<FunctionResponse> => auth.createCustomToken(functionRequest.authenticationResponse.response.userHandle || "").then<FunctionResponse>((customToken: string): FunctionResponse => ({
    customToken: customToken,
    success: true,
    type: functionRequest.type,
  })))) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "not verified",
    success: false,
    type: functionRequest.type,
  }))) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "user doc missing challenge field",
    success: false,
    type: functionRequest.type,
  })))(anonymousUserDocumentSnapshot.data())) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "user doc missing passkey fields",
    success: false,
    type: functionRequest.type,
  })) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "missing user doc",
    success: false,
    type: functionRequest.type,
  })))(userDocumentSnapshot.data())) : (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  }).then<FunctionResponse>((): FunctionResponse => ({
    message: "no action",
    success: false,
    type: functionRequest.type,
  })) : functionRequest.type === "verify reauthentication" ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).get().then<FunctionResponse>(async (userDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<FunctionResponse> => userDocument ? userDocument.credentialId && userDocument.credentialPublicKey ? (async (): Promise<FunctionResponse> => userDocument.challenge ? verifyAuthenticationResponse({
    authenticator: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      counter: userDocument.credentialCounter!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      credentialID: userDocument.credentialId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      credentialPublicKey: userDocument.credentialPublicKey!,
    },
    expectedChallenge: userDocument.challenge,
    expectedOrigin: "https://" + callableContext.rawRequest.hostname,
    expectedRPID: callableContext.rawRequest.hostname,
    requireUserVerification: true,
    response: functionRequest.authenticationResponse,
  }).then<FunctionResponse>(async (verifiedAuthenticationResponse: VerifiedAuthenticationResponse): Promise<FunctionResponse> => verifiedAuthenticationResponse.verified ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
    lastVerified: Timestamp.fromDate(new Date()),
  }).then<FunctionResponse>((): FunctionResponse => ({
    customToken: "",
    success: true,
    type: functionRequest.type,
  })) : (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).update({
    challenge: FieldValue.delete(),
  }).then<FunctionResponse>((): FunctionResponse => ({
    message: "not verified",
    success: false,
    type: functionRequest.type,
  }))) : {
    message: "user doc missing challenge field",
    success: false,
    type: functionRequest.type,
  })() : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "user doc missing passkey fields",
    success: false,
    type: functionRequest.type,
  })) : {
    message: "missing user doc",
    success: false,
    type: functionRequest.type,
  })(userDocumentSnapshot.data())) : functionRequest.type === "verify registration" ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument>).get().then<FunctionResponse>(async (userDocumentSnapshot: DocumentSnapshot<UserDocument>): Promise<FunctionResponse> => (async (userDocument: UserDocument | undefined): Promise<FunctionResponse> => userDocument ? userDocument.challenge ? verifyRegistrationResponse({
    expectedChallenge: userDocument["challenge"],
    expectedOrigin: "https://" + callableContext.rawRequest.hostname,
    expectedRPID: callableContext.rawRequest.hostname,
    requireUserVerification: true,
    response: functionRequest.registrationResponse,
  }).then<FunctionResponse>(async (verifiedRegistrationResponse: VerifiedRegistrationResponse): Promise<FunctionResponse> => verifiedRegistrationResponse.verified ? (firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "") as DocumentReference<UserDocument | undefined>).update({
    challenge: FieldValue.delete(),
    credentialCounter: verifiedRegistrationResponse.registrationInfo?.counter,
    credentialId: verifiedRegistrationResponse.registrationInfo?.credentialID,
    credentialPublicKey: verifiedRegistrationResponse.registrationInfo?.credentialPublicKey,
    lastVerified: Timestamp.fromDate(new Date()),
  }).then<FunctionResponse>(async (): Promise<FunctionResponse> => auth.createCustomToken(callableContext.auth?.uid || "").then<FunctionResponse>((customToken: string): FunctionResponse => ({
    customToken: customToken,
    success: true,
    type: functionRequest.type,
  }))) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "not verified",
    success: false,
    type: functionRequest.type,
  }))) : firestore.collection("ngxFirebaseWebAuthnUsers").doc(callableContext.auth?.uid || "").delete().then<FunctionResponse>((): FunctionResponse => ({
    message: "user doc missing challenge field",
    success: false,
    type: functionRequest.type,
  })) : {
    message: "missing user doc",
    success: false,
    type: functionRequest.type,
  })(userDocumentSnapshot.data())) : ((): never => {
    throw new Error("Invalid function request type.");
  })())(getAuth(), getFirestore()) : {
    message: "missing auth",
    success: false,
    type: functionRequest.type,
  });
