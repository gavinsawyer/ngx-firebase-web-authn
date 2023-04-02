import { Auth, signInWithCustomToken, UserCredential } from "@angular/fire/auth";
import { FunctionResponse }                            from "@ngx-firebase-web-authn/functions";
import { NgxFirebaseWebAuthnError }                    from "./ngx-firebase-web-authn-error";


export const handleVerifyFunctionResponse: (auth: Auth, functionResponse: FunctionResponse) => Promise<UserCredential> = (auth: Auth, functionResponse: FunctionResponse): Promise<UserCredential> => "code" in functionResponse ? ((): never => {
  throw new NgxFirebaseWebAuthnError(functionResponse);
})() : "customToken" in functionResponse ? signInWithCustomToken(auth, functionResponse.customToken)
  .catch<never>((firebaseError): never => {
    throw new NgxFirebaseWebAuthnError({
      code: firebaseError.code,
      message: firebaseError.message,
      method: "signInWithCustomToken",
    });
  }) : ((): never => {
    throw new NgxFirebaseWebAuthnError({
      code: "invalid",
      message: "Invalid function response.",
      operation: functionResponse.operation,
    });
  })();
