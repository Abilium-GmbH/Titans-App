import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordType = "password";
  public eyeType = "eye";
  public pwCheckInterval: any;
  public form: FormGroup;

  emailValidator(control) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  constructor(private fb: FormBuilder, 
    private odooService: OdooService, 
    private router: Router, 
    private alertCtrl: AlertController,
    private translate: TranslateService) { 
    this.form = this.fb.group({
      'email': ['', [Validators.required, this.emailValidator]],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {

    let credentials = this.odooService.getLoginCredentials();
    if(credentials.email && credentials.password) {
      this.form.controls['email'].setValue(credentials.email);
      this.form.controls['password'].setValue(credentials.password);
    }

    if(this.odooService.checkTokenAvailableAndNotExpired()) {
      this.router.navigate(['events']);
    }

    this.form.controls.email.valueChanges.subscribe(v => {
      this.form.controls.email.setValue(this.form.controls.email.value.toLowerCase().replace(/ /g, ''), {emitEvent: false});
    })

    this.pwCheckInterval = setInterval(() => {this.pwDetectTimeout();}, 300);

    this.form.controls.password.valueChanges.subscribe(v => {
      this.form.updateValueAndValidity();
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.pwCheckInterval);
  }

  pwDetectTimeout() {
    let pwIonInput = document.getElementById("pw");
    if(!this.form.controls.password.value && (pwIonInput.children[0] as any).value) {
      this.form.controls.password.setValue((pwIonInput.children[0] as any).value);
    }
  }

  togglePasswordType() {
    if(this.passwordType=='password') {
      this.passwordType = 'text';
      this.eyeType = "eye-off";
    } else {
      this.passwordType = 'password';
      this.eyeType = "eye";
    }
  }

  login() {
    this.odooService.login(this.form.value.email, this.form.value.password).then(v => {
      this.router.navigate(['events']);
    }).catch(e => {
      this.alertCtrl.create({
        header: this.translate.instant("login.error.title"),
        message: this.translate.instant("login.error.message"),
        buttons: [{
          text: this.translate.instant("login.error.close"),
          role: 'close'
        }]
      }).then(a => a.present());
    });
  }

}
