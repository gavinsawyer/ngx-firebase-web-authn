import { Component }   from "@angular/core";
import { PathService } from "./services";


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

  constructor(
    public readonly pathService: PathService,
  ) {}

  public readonly version: string = version;
  public readonly raw: string = raw;

}
