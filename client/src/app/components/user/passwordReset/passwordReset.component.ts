import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-passwordReset',
  templateUrl: 'passwordReset.component.html',
  styleUrls: ['passwordReset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetPassForm: FormGroup;
  currentUser: any;
  profile: any;
  loggedIn: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private user: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    let email = this.route.snapshot.paramMap.get('email');
    let myUser = {};

    if (id !== null && id !== undefined) {
      this.loggedIn = false;

      myUser = {
        id,
        email
      }
    } else {
      this.loggedIn = true;

      this.user.subscribeToUsers();
      this.currentUser = this.authenticationService.currentUserValue;

      myUser = {
        id: this.currentUser.id,
        email: this.currentUser.email
      }
    }

    this.currentUser = myUser;
  }

  ngOnInit() {
    this.resetPassForm = this.formBuilder.group({
      id: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.resetPassForm.controls['email'].setValue(this.currentUser.email);
    this.resetPassForm.controls['id'].setValue(this.currentUser.id);
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPassForm.controls; }

  onSubmit() {
  }

  cancel() {
    this.router.navigate(['/user/profile']);
  }

  changePassword() {
    let passOriginal = this.resetPassForm.get('password').value;
    let passConfirm = this.resetPassForm.get('passwordConfirm').value;

    if (passOriginal === passConfirm) {
      const newUpdate = {
        id: this.currentUser.id,
        email: this.currentUser.email,
        password: passOriginal
      }
      this.user.updateUser(newUpdate).then(() => {
        this.alertService.success('Update successful.', true);
        this.router.navigate(['/user/profile']);
      });
    } else {
      this.alertService.error('The passwords did not match.', true);
    }
  }

}
