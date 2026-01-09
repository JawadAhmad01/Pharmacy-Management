import { Component, OnInit } from '@angular/core';
import { get, ref, getDatabase, update } from 'firebase/database';
import { task } from '../../Interfaces/user';
import { DatePipe } from '@angular/common';
import { Medicine } from '../../Interfaces/medicine';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private db = getDatabase();
  private workerId: string = '';
  protected tasksExpirersSoonArr: task[] = [];
  protected dataArr: Medicine[] = [];
  private authEndpoint = ref(this.db, 'auth');
  protected assignedTasks: number = 0;
  protected lowStock: number = 0;
  protected expired: number = 0;

  ngOnInit(): void {
    this.loggedIn();
    this.snapshot();
  }

  getTasks() {
    get(ref(this.db, `register/${this.workerId}`)).then((item) => {
      const itemsValue = item.val();
      const tempArr: task[] = [];
      Object.values(itemsValue.tasks).forEach((task: any) => {
        if (task.daysLeft <= 2) {
          tempArr.push(task);
        }
        this.assignedTasks += 1;
      });
      this.tasksExpirersSoonArr = tempArr;
    });
  }

  loggedIn() {
    get(this.authEndpoint).then((item) => {
      const itemValue = item.val();
      this.workerId = itemValue.id;
      this.getTasks();
    });
  }

  markDone(taskId: string) {
    update(ref(this.db, `register/${this.workerId}/tasks/${taskId}`), { status: 'Done' });
    this.getTasks();
  }

  snapshot() {
    this.dataArr.forEach((item) => {
      if (item.qty <= 20) {
        this.lowStock += 1;
      }
      const currentDate = new Date().getTime();
      const expiry = new Date(item.expiry).getTime();
      const check = Math.ceil((expiry - currentDate) / (1000 * 60 * 60 * 24));
      if (check <= 0) {
        this.expired += 1;
      }
    });
  }
}
