import { Timestamp } from "firebase-admin/firestore";


export interface UserDocument {
  "challenge"?: string,
  "credentialCounter"?: number,
  "credentialId"?: Uint8Array,
  "credentialPublicKey"?: Uint8Array,
  "lastVerified"?: Timestamp,
}
