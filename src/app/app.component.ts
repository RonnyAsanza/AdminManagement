import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private themeService: ThemeService) { }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        const storedTheme = this.themeService.getStoredTheme();
        if (storedTheme) {
            this.themeService.changeTheme(storedTheme);
        }
    }

}
