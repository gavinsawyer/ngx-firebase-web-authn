import { Component } from "@angular/core";


const { version } = require("../../../../package.json");
const { raw }     = require("../../../../.git-version.json");

@Component({
  selector: "demo-app-root",
  styleUrls: [
    "./app.component.sass"
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent {

  public readonly version: string = version;
  public readonly raw: string = raw;

}
