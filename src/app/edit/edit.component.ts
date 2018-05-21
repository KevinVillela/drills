import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DrillFocus } from '../model/model';

@Component({
  selector: 'drills-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditDrillComponent implements OnInit {

  readonly form: FormGroup;
  readonly levels = [
    {viewValue: 'Beginner', value: 1},
    {viewValue: 'Intermediate', value: 2},
    {viewValue: 'Advanced', value: 3},
    {viewValue: 'Expert', value: 4},
    {viewValue: 'Professional', value: 5},
  ];

  readonly phases = [
    {viewValue: 'Phase I', value: 1},
    {viewValue: 'Phase II', value: 2},
    {viewValue: 'Phase III', value: 3},
    {viewValue: 'Phase IV', value: 4},
    {viewValue: 'Phase V', value: 5},
  ];
  readonly focuses = Object.keys(DrillFocus).filter(key => isNaN(Number(DrillFocus[key])));

  readonly durations = [1, 2, 5, 10, 15, 20, 25, 30, 45, 60];

  constructor(private readonly fb: FormBuilder) {
    this.form =  this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      level: [this.levels[0], Validators.required],
      focus: [],
      duration: [this.durations[0], Validators.required],
      phase: [this.phases [0], Validators.required],
      minPlayers: [1],
      maxPlayers: [2],
    });
  }

  ngOnInit() {
  }

  save() {
    console.log(this.form.value);
  }
}
