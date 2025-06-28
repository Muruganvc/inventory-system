import { Directive, HostListener, Input } from "@angular/core";

@Directive({
  selector: '[appNumberOnly]',
  standalone: true // ✅ Add this line
})
export class NumberOnlyDirective {
  @Input() appNumberOnly = true;

  private regex: RegExp = /^\d*\.?\d{0,2}$/;

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (!this.appNumberOnly) return;

    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(event.key)) return;

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const newValue =
      value.substring(0, input.selectionStart!) +
      event.key +
      value.substring(input.selectionEnd!);

    if (!this.regex.test(newValue)) {
      event.preventDefault();
    }
  }
}
