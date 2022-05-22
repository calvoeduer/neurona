import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuronaFormComponent } from './neurona-form.component';

describe('NeuronaFormComponent', () => {
  let component: NeuronaFormComponent;
  let fixture: ComponentFixture<NeuronaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuronaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuronaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
