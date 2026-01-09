import { Component, OnInit } from '@angular/core';
import { ref, getDatabase, get } from 'firebase/database';
import { Medicine } from '../../Interfaces/medicine';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [NgClass, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory implements OnInit {
  protected medicinesArr: Medicine[] = [];
  protected filterMedicinesArr: Medicine[] = [];
  protected lowStock: number = 0;
  protected stockOut: number = 0;
  protected expireSoon: number = 0;
  protected expired: number = 0;
  protected searchVal: string = '';
  protected categoryVal: string = 'All';
  private db = getDatabase();
  private medEndpoint = ref(this.db, 'medicines');
  protected invalidQ: boolean = false;

  ngOnInit(): void {
    this.getMedicnes();
  }
  snapshot() {
    this.medicinesArr.forEach((item) => {
      if (item.qty <= 20) {
        this.lowStock += 1;
      }
      if (item.qty <= 0) {
        this.stockOut += 1;
      }

      if (item.daysLeft <= 10) {
        this.expireSoon += 1;
      }
      if (item.daysLeft <= 0) {
        this.expired += 1;
      }
    });
  }

  getMedicnes() {
    get(this.medEndpoint).then((getAll) => {
      const tempArr: Medicine[] = [];
      getAll.forEach((childs) => {
        const value = childs.val();
        tempArr.push({ id: childs.key, ...value });
      });
      this.medicinesArr = tempArr;
      this.filterMedicinesArr = tempArr;
      this.snapshot();
    });
  }
  search() {
    this.invalidQ = true;
    const searchQuery = this.searchVal.toLowerCase();
    document.querySelectorAll('.all').forEach((item) => {
      const name = item.querySelector('.name')?.textContent.toLowerCase();

      if (name?.includes(searchQuery)) {
        (item as HTMLElement).style.display = '';
        this.invalidQ = false;
      } else {
        (item as HTMLElement).style.display = 'none';
      }
    });
  }
  searchByCatlog() {
    const query = this.categoryVal.toLowerCase();
    if (this.categoryVal === 'All') {
      this.medicinesArr = [...this.filterMedicinesArr];
      return;
    }
    this.medicinesArr = this.filterMedicinesArr.filter((find) => {
      return find.category.toLowerCase() === query;
    });
  }
}
