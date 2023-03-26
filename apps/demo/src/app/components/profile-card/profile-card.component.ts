import { CommonModule }                            from "@angular/common";
import { Component }                               from "@angular/core";
import { Auth, signInAnonymously, UserCredential } from "@angular/fire/auth";
import { Functions }                               from "@angular/fire/functions";
import { MatButtonModule }                         from "@angular/material/button";
import { MatCardModule }                           from "@angular/material/card";
import { MatSnackBar, MatSnackBarModule }          from "@angular/material/snack-bar";
import { confirmUserWithPasskey }                  from "@ngx-firebase-web-authn/browser";
import { ProfileService }                          from "../../services";


@Component({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  selector: "demo-app-profile-card",
  standalone: true,
  styleUrls: [
    "./profile-card.component.sass",
  ],
  templateUrl: "./profile-card.component.html",
})
export class ProfileCardComponent {

  constructor(
    private readonly auth: Auth,
    private readonly functions: Functions,
    private readonly matSnackBar: MatSnackBar,

    public readonly profileService: ProfileService,
  ) {
    this
      .confirmUserWithPasskey = (): Promise<void> => confirmUserWithPasskey(auth, functions)
      .then<void, void>((_void: void): void => matSnackBar.open("Reauthentication successful.", "Okay.") && void(0))
      .catch<void>((reason: any): void => matSnackBar.open("Something went wrong", "Okay.") && console.error(reason));
    this
      .signInAnonymously = (): Promise<void> => signInAnonymously(auth)
      .then<void>((_userCredential: UserCredential): void => void(0));
  }

  public readonly confirmUserWithPasskey: () => Promise<void>;
  public readonly signInAnonymously: () => Promise<void>;

}