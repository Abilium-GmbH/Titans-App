import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-forgotpw',
  templateUrl: './forgotpw.page.html',
  styleUrls: ['./forgotpw.page.scss'],
})
export class ForgotpwPage implements OnInit {

  form: FormGroup;
  error: boolean = false;

  constructor(private fb: FormBuilder, private odooService: OdooService, private router: Router) { 
    this.form = this.fb.group({
      'email': [''],
    });
  }

  ngOnInit() {
  }

  resetPassword() {
    this.error = false;
    this.odooService.resetPassword(this.form.value.email).then(s => {
      this.router.navigate(['/login']);
    }).catch(e => {
      console.log(e);
      this.error = true;
    });
  }

}
