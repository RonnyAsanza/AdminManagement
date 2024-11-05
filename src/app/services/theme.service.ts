import { Injectable } from '@angular/core';
import { LayoutService } from '../layout/service/app.layout.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {

    constructor(private layoutService: LayoutService, private localStorageService: LocalStorageService) { }

    changeTheme(theme: string) {
        this.localStorageService.setItem('appTheme', theme);
        const themeLink = <HTMLLinkElement>document.getElementById('theme-link');
        const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.onConfigUpdate();
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-link';
        const themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }   

    async getStoredTheme(): Promise<string> {
        var  appTheme = await this.localStorageService.getString('appTheme');
        return appTheme || 'teal';
    }
}