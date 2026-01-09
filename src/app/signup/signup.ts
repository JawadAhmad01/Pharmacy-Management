import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  getDatabase,
  ref,
  push,
  update,
  get,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private db = getDatabase();
  private usersRef = ref(this.db, 'register');
  signUpForm!: FormGroup;

  ngOnInit(): void {
    this.formInit();
  }
  formInit() {
    this.signUpForm = this.fb.group({
      fullname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitData() {
    const userData = {
      fullname: this.signUpForm.value.fullname,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      phone: this.signUpForm.value.phone,
      role: 'none',
    };
    const queryEmail = query(this.usersRef, orderByChild('email'), equalTo(userData.email));

    get(queryEmail).then((find) => {
      if (find.exists()) {
        alert('E-mail Already Registered');
        return;
      } else {
        const newUserRef = push(this.usersRef, userData);
        update(newUserRef, { id: newUserRef.key });
        this.router.navigateByUrl('/signin');
        this.signUpForm.reset();
      }
    });
  }
}
