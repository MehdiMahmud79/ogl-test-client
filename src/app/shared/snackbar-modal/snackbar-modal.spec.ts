import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarModal } from './snackbar-modal';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SnackbarModal', () => {
  let component: SnackbarModal;
  let fixture: ComponentFixture<SnackbarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarModal],
      providers: [provideZonelessChangeDetection()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SnackbarModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
