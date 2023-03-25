import { CommonModule }                                                     from "@angular/common";
import { Component }                                                        from "@angular/core";
import { Auth, signInAnonymously, UserCredential }                          from "@angular/fire/auth";
import { Functions }                                                        from "@angular/fire/functions";
import { FormControl, FormGroup, ReactiveFormsModule }                      from "@angular/forms";
import { MatButtonModule }                                                  from "@angular/material/button";
import { MatCardModule }                                                    from "@angular/material/card";
import { MatFormFieldModule }                                               from "@angular/material/form-field";
import { MatIconModule }                                                    from "@angular/material/icon";
import { MatInputModule }                                                   from "@angular/material/input";
import { confirmUserWithPasskey, createUserWithPasskey, signInWithPasskey } from "@ngx-firebase-web-authn/browser";
import { BehaviorSubject, Observable }                                      from "rxjs";
import { AuthenticationService }                                            from "../../services/authentication.service";


interface LoginForm {
  "displayName"?: FormControl<string>,
}

type LoginFormStatus = "unsent" | "pending" | "complete";

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: "demo-app-home",
  standalone: true,
  styleUrls: [
    "./home.component.sass",
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent {

  constructor(
    private readonly auth: Auth,
    private readonly functions: Functions,

    public readonly authenticationService: AuthenticationService,
  ) {
    this
      .confirmUserWithPasskey = (): Promise<void> => confirmUserWithPasskey(auth, functions);
    this
      .formGroup = new FormGroup<LoginForm>({
        displayName: new FormControl("", {
          nonNullable: true,
        }),
      });
    this
      .signInAnonymously = (): Promise<void> => signInAnonymously(auth)
      .then<void>((_userCredential: UserCredential): void => void(0));
    this
      .signInWithPasskey = (): Promise<void> => signInWithPasskey(auth, functions)
      .then<void>((_userCredential: UserCredential): void => void(0));
    this
      .statusSubject = new BehaviorSubject<LoginFormStatus>("unsent");
    this
      .statusObservable = this
      .statusSubject
      .asObservable();
    this
      .submit = async (): Promise<void> => {
        this
          .statusSubject
          .next("pending");

        return this
          .formGroup
          .value
          .displayName ? await createUserWithPasskey(auth, functions, this.formGroup.value.displayName)
          .then<void, void>((_userCredential: UserCredential): void => {
            this
              .formGroup
              .disable();

            this
              .statusSubject
              .next("complete");
          })
          .catch<void>((_reason: any): void => this.statusSubject.next("unsent")): this
          .statusSubject
          .next("unsent");
      };
  }

  private readonly statusSubject: BehaviorSubject<LoginFormStatus>;

  public readonly confirmUserWithPasskey: () => Promise<void>;
  public readonly formGroup: FormGroup<LoginForm>;
  public readonly signInAnonymously: () => Promise<void>;
  public readonly signInWithPasskey: () => Promise<void>;
  public readonly statusObservable: Observable<LoginFormStatus>;
  public readonly submit: () => void;

}
