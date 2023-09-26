import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNoSpecialCharacters]'
})
export class NoSpecialCharactersDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
    inputElement.value = inputValue.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }
}