import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedWork } from './assigned-work';

describe('AssignedWork', () => {
  let component: AssignedWork;
  let fixture: ComponentFixture<AssignedWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
