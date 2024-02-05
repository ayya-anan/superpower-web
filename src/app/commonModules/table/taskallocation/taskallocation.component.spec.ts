import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskallocationComponent } from './taskallocation.component';

describe('TaskallocationComponent', () => {
  let component: TaskallocationComponent;
  let fixture: ComponentFixture<TaskallocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskallocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
