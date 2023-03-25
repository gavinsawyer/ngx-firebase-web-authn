export interface UserDocument {
  "challenge"?: string,
  "credentialCounter"?: number,
  "credentialId"?: Uint8Array,
  "credentialPublicKey"?: Uint8Array,
}
