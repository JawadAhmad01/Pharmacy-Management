import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user';
import { get, ref, getDatabase, push, update } from 'firebase/database';

import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-workers',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './workers.html',
  styleUrl: './workers.scss',
})
export class Workers implements OnInit {
  private db = getDatabase();
  private workers = ref(this.db, 'register');
  protected usersArr: User[] = [];
  protected filterUsersArr: User[] = [];
  private fb = inject(FormBuilder);
  protected tasksForm!: FormGroup;
  protected activate: boolean = false;
  protected showForm: boolean = false;
  protected searchVal: string = '';
  protected workerName: string = '';
  private workerId: string = '';
  protected filterVal: string = 'All';
  protected invalidQ: boolean = false;

  ngOnInit(): void {
    this.getUsers();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.formInit();
    this.addTask();
  }

  formInit() {
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([]),
    });
  }

  getName(id: string, name: string) {
    this.workerId = id;
    this.workerName = name;
  }

  get tasks(): FormArray {
    return this.tasksForm.get('tasks') as FormArray;
  }

  newTask(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      taskDesc: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  addTask() {
    this.tasks.push(this.newTask());
  }

  removeTask(id: number) {
    if (id === 0) {
      return;
    }
    this.tasks.removeAt(id);
  }

  toggleBtn() {
    this.activate = !this.activate;
  }

  submitForm() {
    if (!this.workerId || this.tasks.length === 0) return;

    const current = Date.now();
    const workerTasks = ref(this.db, `register/${this.workerId}/tasks`);

    this.tasks.value.forEach((task: any) => {
      const expiry = new Date(task.dueDate).getTime();

      const days = Math.max(0, Math.ceil((expiry - current) / (1000 * 60 * 60 * 24)));

      const taskRef = task.key ? push(workerTasks, task.key) : push(workerTasks);
      const key = task.key || taskRef.key;
      update(taskRef, {
        status: 'Pending',
        id: key,
        ...task,
        daysLeft: days,
      });
    });

    this.tasksForm.reset();
    this.formInit();
    this.addTask();
  }

  getUsers() {
    get(this.workers).then((snapshot) => {
      const tempArr: User[] = [];

      snapshot.forEach((child) => {
        const userVal = child.val();
        if (userVal.role !== 'admin') {
          tempArr.push({ ...userVal });
        }
      });

      this.usersArr = tempArr;
      this.filterUsersArr = tempArr;
    });
  }

  ActiveInactive(id: string) {
    update(ref(this.db, `register/${id}`), { role: this.activate ? 'worker' : '' }).then(() => {
      this.getUsers();
    });
  }

  search() {
    this.invalidQ = true;
    const query = this.searchVal.toLowerCase();
    document.querySelectorAll('.all').forEach((item) => {
      const name = item.querySelector('.name')?.textContent.toLowerCase();
      const email = item.querySelector('.email')?.textContent.toLowerCase();
      if (name?.includes(query) || email?.includes(query)) {
        (item as HTMLElement).style.display = '';
        this.invalidQ = false;
      } else {
        (item as HTMLElement).style.display = 'none';
      }
    });
  }
  searchByCatlog() {
    const queryvalue = this.filterVal.toLowerCase();
    if (this.filterVal === 'All') {
      this.usersArr = [...this.filterUsersArr];
      return;
    }
    this.usersArr = this.filterUsersArr.filter((find) => {
      return find.role.toLowerCase() === queryvalue;
    });
  }
}
