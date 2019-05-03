import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Prevent any buttons from being focused. Scanning a card might click those buttons.
    document.addEventListener(
      'focus',
      (ev: FocusEvent) => {
        const target = <HTMLElement>ev.target;
        if (target.nodeName === 'BUTTON') {
          target.blur();
        }
      },
      true
    );
  }
}
