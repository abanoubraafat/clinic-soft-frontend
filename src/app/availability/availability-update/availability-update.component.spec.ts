import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityUpdateComponent } from './availability-update.component';

describe('AvailabilityUpdateComponent', () => {
  let component: AvailabilityUpdateComponent;
  let fixture: ComponentFixture<AvailabilityUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailabilityUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
