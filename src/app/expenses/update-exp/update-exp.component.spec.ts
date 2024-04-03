import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpComponent } from './update-exp.component';

describe('UpdateExpComponent', () => {
  let component: UpdateExpComponent;
  let fixture: ComponentFixture<UpdateExpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateExpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
