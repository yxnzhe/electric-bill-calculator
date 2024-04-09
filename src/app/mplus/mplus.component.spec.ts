import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MplusComponent } from './mplus.component';

describe('MplusComponent', () => {
  let component: MplusComponent;
  let fixture: ComponentFixture<MplusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MplusComponent]
    });
    fixture = TestBed.createComponent(MplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
