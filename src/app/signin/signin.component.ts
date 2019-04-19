import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { EncrypService } from "../encryp.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
  emailadd: any = null;
  passwd: any = null;
  showspinner: any = false;
  constructor(
    private _db: AngularFirestore,
    private _enc: EncrypService,
    private _router: Router
  ) {}

  ngOnInit() {
    if (sessionStorage) {
      if (sessionStorage.getItem("uid")) {
        this._router.navigate(["/db"]);
      }
    }
  }

  login() {
    this.showspinner = true;
    if (this.emailadd) {
      let vm = this;

      this._db
        .collection(this.emailadd)
        .doc("userdets")
        .ref.get()
        .then(function(doc) {
          if (doc.data()) {
            let pwd = vm._enc.decrypt(doc.data().passwd);
            console.log(pwd);
            if (pwd == vm.passwd) {
              vm.showspinner = false;
              sessionStorage.setItem("uid", vm._enc.encrypt(doc.data()));
              vm._router.navigate(["/db"]);
            } else {
              vm.showspinner = false;
              alert("Invalid email id or password");
              vm.emailadd = null;
              vm.passwd = null;
            }
          } else {
            vm.showspinner = false;
            alert("Invalid email id or password");
            vm.emailadd = null;
            vm.passwd = null;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }

  checkEvent(event) {
    if (event.key == "Enter") {
      this.login();
    }
  }
}
