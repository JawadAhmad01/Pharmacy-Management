import { Component, OnInit } from '@angular/core';
import { get, ref, getDatabase, update } from 'firebase/database';
import { task } from '../../Interfaces/user';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assigned-work',
  imports: [DatePipe, NgClass, FormsModule],
  templateUrl: './assigned-work.html',
  styleUrl: './assigned-work.scss',
})
export class AssignedWork implements OnInit {
  protected tasksArr: task[] = [];
  protected filterTasksArr: task[] = [];
  private db = getDatabase();
  private authEndpoint = ref(this.db, 'auth');
  protected workerId: string = '';
  protected filterVal: string = 'All';

  ngOnInit(): void {
    this.loggedIn();
  }

  getTasks() {
    get(ref(this.db, `register/${this.workerId}`)).then((item) => {
      const itemsValue = item.val();
      const tempArr: task[] = [];
      Object.values(itemsValue.tasks).forEach((task: any) => {
        tempArr.push(task);
      });
      this.tasksArr = tempArr;
      this.filterTasksArr = tempArr;
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
  filterTasks() {
    const searchQ = this.filterVal.toLowerCase();

    if (searchQ === 'all') {
      this.tasksArr = [...this.filterTasksArr];
      return;
    }
    this.tasksArr = this.filterTasksArr.filter((find) => {
      return find.priority.toLowerCase() === searchQ;
    });
  }
}
