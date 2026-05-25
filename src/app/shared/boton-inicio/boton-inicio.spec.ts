import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonInicio } from './boton-inicio';

describe('BotonInicio', () => {
  let component: BotonInicio;
  let fixture: ComponentFixture<BotonInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
