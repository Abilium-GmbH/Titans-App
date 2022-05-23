import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ResCountry } from '../models/country';
import { ResLang } from '../models/lang';
import { ResPartner } from '../models/partner';
import { PartnerGroup } from '../models/partner_group';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, AfterViewInit {

  form: FormGroup;
  fields_values: {name: string, 
    value: string, 
    editable: boolean, 
    type: string, 
    combo_values: any[],
    form_control: FormControl
  }[] = [];
  groups: {id: number, name: string}[] = [];
  editing: boolean = false;
  constructor(private odooService: OdooService, private fb: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.form = this.fb.group({});
    this.odooService.getData(ResPartner.model, ResPartner.fields, this.odooService.partner_id).then(res => {
      if(res.length==1) {
        for(let f of Object.keys(res[0]).filter(k => k!="id" && k!="partner_group_ids")) {
          let editable = ResPartner.fields_changeable.indexOf(f)>=0;
          let formControl = new FormControl(res[0][f]);
          this.form.addControl(f, formControl);
          let fv = {'name': f, 
            'value': this.odooService.adm(ResPartner, f, res[0][f]), 
            'editable': editable,
            'type': ResPartner.fields[f],
            'combo_values': null,
            'form_control': formControl
          };
          this.fields_values.push(fv);
        }
        
        this.odooService.getData(PartnerGroup.model, PartnerGroup.fields, res[0]['partner_group_ids']).then(v => {
          this.groups = v;
        });
        let lang_field = this.fields_values.find(f => f.name=='lang');
        if(lang_field) {
          this.odooService.getAll(ResLang.model, ResLang.fields).then(v => {
            lang_field.combo_values = v;
            let langId = v.find(l => l.code == this.form.controls.lang.value);
            this.form.controls.lang.setValue(langId.id);
          });
        }

        let country_field = this.fields_values.find(f => f.name=='country_id');
        if(country_field) {
          this.odooService.getAll(ResCountry.model, ResCountry.fields).then(v => {
            country_field.combo_values = v;
          });
        }
      }
    })
  }

  ngAfterViewInit(): void {
    
  }

  startEditing() {
    this.editing = true;
  }

  endEditing() {
    let dirtyValues = {};
    for(let c of Object.keys(this.form.controls)) {
      if(this.form.controls[c].dirty) {
        dirtyValues[c] = this.form.controls[c].value;
      }
    }
    if(dirtyValues['birthday']) {
      let splitted = dirtyValues['birthday'].toISOString().split("T")
      dirtyValues['birthday'] = splitted[0] + " " + splitted[1].split(".")[0]
    }
    if(dirtyValues['lang']) {
      let lang_field = this.fields_values.find(f => f.name=='lang');
      dirtyValues['lang'] = lang_field.combo_values.find(l => l.id == dirtyValues['lang']).code;
    }
    
    if(Object.keys(dirtyValues).length>0) {
      this.odooService.updateProfile(dirtyValues).then(s => {
        if(dirtyValues['lang']) {
          this.translate.use(dirtyValues['lang'].substring(0,2));
        }
      })
    }
    this.editing = false;
  }

  convDate(date: string) {
    if(date) {
      return new Date(date);
    } else {
      return "";
    }
    
  }

}