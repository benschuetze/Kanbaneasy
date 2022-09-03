import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MoveTaskModalComponent } from '../move-task-modal/move-task-modal.component';
import { TaskViewerComponent } from '../task-viewer/task-viewer.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor(private router: Router, private firestore: AngularFirestore, public dialog: MatDialog) { }

  tasks: object[];
  toDo: object[];
  inProgress: object[];
  testing: object[];
  done: object[];
  selectedTask: object;

  ngOnInit(): void {

    this.firestore
    .collection('tasks')
    .valueChanges( { idField: 'id'})
    .subscribe((tasks: object[]) => {
      this.tasks = tasks;
      this.toDo = tasks.filter(t => t['boardState'] == 'to-do');
      this.inProgress = tasks.filter(t => t['boardState'] == 'in-progress');
      this.testing = tasks.filter(t => t['boardState'] == 'testing');
      this.done = tasks.filter(t => t['boardState'] == 'done');
    })
  }

  selectTask(task: object) {
    this.selectedTask = task;
  }


  /**
   * 
   * @param event : Event Data;
   * @param containerId : Id of parent container for sorting of tasks and rendering accordingly 
   */

   drop(event: CdkDragDrop<object[]>, containerId: string) {
    this.selectedTask['boardState'] = containerId;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
      this.firestore
      .collection('tasks')
      .doc(this.selectedTask['id'])
      .update(this.selectedTask);;
    }
  }

  //edit Task and save Changes in Firestore Database

  editTask() {
    event.stopPropagation();
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: {
        task: this.selectedTask
      }
    });

    dialogRef.afterClosed().subscribe((editedTask: any) => { // editedTask is change from dialog
      let taskIndex = this.tasks.indexOf(this.selectedTask);
      if (editedTask) { 
        if (editedTask == 'cancel') {
          return
        } else {
          this.saveEditedTask(editedTask, taskIndex);
        }

      }
    });
  }

  moveTask() {
    event.stopPropagation();
    const dialogRef = this.dialog.open(MoveTaskModalComponent, {
      data: {      
        task: this.selectedTask
      }
    });

    dialogRef.afterClosed().subscribe((movedTask: any) => { // editedTask is change from dialog
      let taskIndex = this.tasks.indexOf(this.selectedTask);
      if (movedTask) { 
        if (movedTask == 'cancel') {
          return
        } else {
           this.saveEditedTask(movedTask, taskIndex);
        }

      }
    });
  }

  showTask() {
    event.stopPropagation();
    const dialogRef = this.dialog.open(TaskViewerComponent, {
      data: {
        task: this.selectedTask
      }
    });

    dialogRef.afterClosed().subscribe(() => { 
      return
    });
  }


  saveEditedTask(editedTask: any, taskIndex:number) {
    this.tasks[taskIndex] = editedTask;
    this.firestore
      .collection('tasks')
      .doc(editedTask['id'])
      .update(editedTask);
  }



  removeFromBoard() {
    event.stopPropagation();
    this.firestore
    .collection('tasks')
    .doc(this.selectedTask['id'])
    .delete()
    .then(res => {
      console.log(' deleted Successfully');
    })
   .catch((error) => {
      console.error('Error removing document: ', error);
   });


  }

}
