import { UnknownFunctionResponseUnsuccessful } from "@ngx-firebase-web-authn/functions";


interface NgxFirebaseWebAuthnErrorOptions {
  "code": UnknownFunctionResponseUnsuccessful["code"] | "cancelled" | "invalid",
  "message": UnknownFunctionResponseUnsuccessful["message"] | "Cancelled by user." | "Invalid function response.",
  "method"?: "httpsCallableFromURL" | "signInAnonymously" | "signInWithCustomToken",
  "operation"?: UnknownFunctionResponseUnsuccessful["operation"],
}
export class NgxFirebaseWebAuthnError extends Error {

  constructor(
    private readonly ngxFirebaseWebAuthnErrorOptions: NgxFirebaseWebAuthnErrorOptions,
  ) {
    super(ngxFirebaseWebAuthnErrorOptions.message);

    this
      .code = `ngxFirebaseWebAuthn/${ngxFirebaseWebAuthnErrorOptions.code}`;
    this
      .method = ngxFirebaseWebAuthnErrorOptions
      .method;
    this
      .operation = ngxFirebaseWebAuthnErrorOptions
      .operation;
  }

  public override readonly message!: NgxFirebaseWebAuthnErrorOptions["message"];

  public readonly code: `ngxFirebaseWebAuthn/${NgxFirebaseWebAuthnErrorOptions["code"]}`;
  public readonly method?: NgxFirebaseWebAuthnErrorOptions["method"];
  public readonly operation?: NgxFirebaseWebAuthnErrorOptions["operation"];

}
