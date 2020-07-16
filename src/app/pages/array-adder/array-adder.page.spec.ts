import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayAdderPage } from './array-adder.page';

describe('ArrayAdderPage', () => {
  let component: ArrayAdderPage;
  let fixture: ComponentFixture<ArrayAdderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayAdderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayAdderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
