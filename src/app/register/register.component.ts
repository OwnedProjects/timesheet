import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { EncrypService } from "../encryp.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  user: Observable<any> = null;
  emailadd: string = null;
  name: string = null;
  pass: string = null;
  confpass: string = null;
  emailispresent: any = null;
  showmsg: boolean = false;
  regsucess: boolean = false;

  constructor(
    private _db: AngularFirestore,
    private _enc: EncrypService,
    private _router: Router
  ) {}

  ngOnInit() {}

  checkEmail() {
    if (this.emailadd) {
      let user = this._db
        .collection(this.emailadd)
        .valueChanges()
        .subscribe(Response => {
          if (Response.length > 0) {
            this.emailispresent = true;
          } else {
            this.emailispresent = false;
          }
          console.log(this.emailispresent);

          this.showmsg = true;
        });
    }
  }

  registerUser() {
    let cryptpass = this._enc.encrypt(this.pass);
    let userdet = {
      email: this.emailadd,
      name: this.name,
      passwd: cryptpass
    };

    this._db
      .collection(this.emailadd)
      .doc("userdets")
      .set(userdet)
      .then(Response => {
        window.scrollTo(0, 0);
        this.regsucess = true;
        this.showmsg = false;
        this.emailadd = this.name = this.pass = this.confpass = null;
        let vm = this;
        window.setTimeout(function() {
          vm._router.navigate(["/signin"]);
        }, 2000);
      });
  }
}
