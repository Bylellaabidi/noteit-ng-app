import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySchedulerComponent } from './my-scheduler.component';

describe('MySchedulerComponent', () => {
  let component: MySchedulerComponent;
  let fixture: ComponentFixture<MySchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
