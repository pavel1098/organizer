import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { DateService } from 'src/app/shared/date.service';
import { Task, TasksService } from 'src/app/shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[] = [];

  constructor(
    public dateService: DateService,
    public tasksService: TasksService) { }



  ngOnInit(): void {

    this.dateService.date.pipe(
      switchMap(val => this.tasksService.load(val))
    ).subscribe(tasks => this.tasks = tasks)

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit() {
    const {title} = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    this.tasksService.create(task).subscribe(task => {
      this.tasks.push(task);
      this.form.reset();
    }, error => {console.error(error)});
  }

  remove(task: Task) {
    this.tasksService.remove(task).subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      }, err => console.error(err))
  }

}
