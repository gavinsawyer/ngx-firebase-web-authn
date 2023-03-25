import { CommonModule } from "@angular/common";
import { Component }    from "@angular/core";


@Component({
  imports: [
    CommonModule,
  ],
  selector: "demo-app-home",
  standalone: true,
  styleUrls: [
    "./home.component.sass",
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent {}
