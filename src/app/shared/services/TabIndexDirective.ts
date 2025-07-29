import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appTabIndex]',
  standalone: true
})
export class TabIndexDirective implements OnInit {

  @Input() appTabIndex: number;  // Input to dynamically set the tabindex

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    console.log('TabIndexDirective initialized with tabIndex:', this.appTabIndex);

    if (this.appTabIndex !== undefined && this.appTabIndex !== null) {
      // Dynamically set the tabindex on the element
      this.renderer.setAttribute(this.el.nativeElement, 'tabindex', this.appTabIndex.toString());
      console.log('Tab index set on element:', this.appTabIndex);
    }
  }
}

