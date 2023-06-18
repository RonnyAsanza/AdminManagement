import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select-permittype',
  templateUrl: './select-permittype.component.html',
  styleUrls: ['./select-permittype.component.scss']
})
export class SelectPermittypeComponent {
  @Output() permitTypeSelected = new EventEmitter<number>();

}
