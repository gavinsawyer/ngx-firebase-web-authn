import { UnknownFunctionResponseUnsuccessful } from "@ngx-firebase-web-authn/functions";


interface NgxFirebaseWebAuthnErrorOptions {
  "code": UnknownFunctionResponseUnsuccessful["code"] | "cancelled" | "invalid",
  "message": UnknownFunctionResponseUnsuccessful["message"] | "Cancelled by user." | "Invalid function response.",
  "operation": UnknownFunctionResponseUnsuccessful["operation"],
}
export class NgxFirebaseWebAuthnError extends Error {

  constructor(
    private readonly ngxFirebaseWebAuthnErrorOptions: NgxFirebaseWebAuthnErrorOptions,
  ) {
    super(ngxFirebaseWebAuthnErrorOptions.message);

    this
      .code = `ngxFirebaseWebAuthn/${ngxFirebaseWebAuthnErrorOptions.code}`;
    this
      .operation = ngxFirebaseWebAuthnErrorOptions
      .operation;
  }

  public readonly code: `ngxFirebaseWebAuthn/${NgxFirebaseWebAuthnErrorOptions["code"]}`;
  public override readonly message!: NgxFirebaseWebAuthnErrorOptions["message"];
  public readonly operation: NgxFirebaseWebAuthnErrorOptions["operation"];

}
