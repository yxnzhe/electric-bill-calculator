import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TncComponent } from './tnc.component';

describe('TncComponent', () => {
  let component: TncComponent;
  let fixture: ComponentFixture<TncComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TncComponent]
    });
    fixture = TestBed.createComponent(TncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
