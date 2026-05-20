import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetesComponent } from './paquetes';

describe('Paquetes', () => {
  let component: PaquetesComponent;
  let fixture: ComponentFixture<PaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaquetesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaquetesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
