import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordType = "password";
  public eyeType = "eye";
  public form: FormGroup;

  constructor(private fb: FormBuilder, private odooService: OdooService, private router: Router) { 
    this.form = this.fb.group({
      'email': [''],
      'password': ['']
    });
  }

  ngOnInit() {
    if(this.odooService.checkTokenAvailableAndNotExpired()) {
      this.router.navigate(['events']);
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

    });
  }

}
