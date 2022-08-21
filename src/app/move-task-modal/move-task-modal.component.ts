import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-move-task-modal',
  templateUrl: './move-task-modal.component.html',
  styleUrls: ['./move-task-modal.component.scss']
})
export class MoveTaskModalComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<MoveTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

}
