import { isPlatformBrowser }                                            from "@angular/common";
import { Inject, Injectable, OnDestroy, PLATFORM_ID }                                   from "@angular/core";
import { Auth, onIdTokenChanged, signInAnonymously, Unsubscribe, User, UserCredential } from "@angular/fire/auth";
import { Observable, shareReplay, Subject }                                             from "rxjs";


@Injectable({
  providedIn: "root",
})
export class AuthenticationService implements OnDestroy {

  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: object,

    private readonly auth: Auth,
  ) {
    this
      .unsubscribeIdTokenChanged = onIdTokenChanged(auth, (async (user: User | null): Promise<void> => user ? this.userSubject.next(user) : isPlatformBrowser(platformId) ? signInAnonymously(auth).then<void>((_userCredential: UserCredential): void => void (0)).catch<void>((reason: any): void => console.error(reason)) : void(0)));
    this
      .userSubject = new Subject<User>();
    this
      .userObservable = this
      .userSubject
      .asObservable()
      .pipe<User>(
        shareReplay<User>(1),
      );

    isPlatformBrowser(platformId) || this
      .unsubscribeIdTokenChanged();
  }

  private readonly unsubscribeIdTokenChanged: Unsubscribe;
  private readonly userSubject: Subject<User>;

  public readonly userObservable: Observable<User>;

  ngOnDestroy(): void {
    this
      .unsubscribeIdTokenChanged();
  }

}
