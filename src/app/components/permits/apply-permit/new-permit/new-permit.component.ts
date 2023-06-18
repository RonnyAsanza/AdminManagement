import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-permit',
  templateUrl: './new-permit.component.html',
  styleUrls: ['./new-permit.component.scss'],
  providers: [MessageService]
})
export class NewPermitComponent  {
  selectedIndex: number = 0;
  disablePagination: boolean = true;

  onGoBack(){
    if(this.selectedIndex !== 0)
     this.selectedIndex--;
  }

  onGoNext(){
    this.selectedIndex++;
  }

  onSelectPermitType(value: any) {
    console.log(value);
    this.selectedIndex = 1;
  }
}
