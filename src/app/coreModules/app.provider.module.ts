import { NgModule } from '@angular/core';

declare global {
    interface String {
        interpolateString(s: {}): string;
    }
}

String.prototype.interpolateString = function(params: any): string {
    const names = Object.keys(params);
    const vals = names.map((k) => params[k]);
    return new Function(...names, `return \`${this}\`;`)(...vals);
};


@NgModule()
export class AppProviderModule { }
