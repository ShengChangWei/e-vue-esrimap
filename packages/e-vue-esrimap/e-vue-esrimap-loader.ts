export default class EVueErimapLoader {

    private getScript() {
        return document.getElementById('ess_arcgis_js');
    };

    // load the ArcGIS API on the page
    private bootstrap(callback?: (error: Error, dojoRequire?: any) => void, options = {} as any) {
        // default options
        if (!options.url) {
            options.url = 'http://js.arcgis.com/3.23/';
        }

        // don't reload API if it is already loaded or in the process of loading
        if (this.getScript()) {
            if (callback) {
                callback(new Error('The ArcGIS API for JavaScript is already loaded.'));
            }
            return;
        }

        // create a script object whose source points to the API
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = options.url;
        script.id = 'ess_arcgis_js';

        // once the script is loaded...
        script.onload = () => {

            // we can now use Dojo's require() to load esri and dojo AMD modules
            const _dojoRequire = (window as any)['require'];

            if (callback) {
                // let the caller know that the API has been successfully loaded
                // and as a convenience, return the require function
                // in case they want to use it directly
                callback(null, _dojoRequire);
            }
        };

        // load the script
        document.body.appendChild(script);
    }

    private dojoRequire(modules: string[], callback: (modules: any[]) => void) {
        if (this.isLoaded()) {
            // already loaded, just call require
            (window as any)['require'](modules, callback);
        } else {
            // wait for script to load then call require
            const script = this.getScript();
            if (script) {
                // Not yet loaded but script is in the body - use callback once loaded
                const onScriptLoad = () => {
                    (window as any)['require'](modules, callback);
                    script.removeEventListener('load', onScriptLoad, false);
                };
                script.addEventListener('load', onScriptLoad, false);
            } else {
                // Not bootstrapped
                throw new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
            }
        }
    };

    // has ArcGIS API been loaded on the page yet?
    isLoaded() {
        // TODO: instead of checking that require is defined, should this check if it is a function?
        return typeof (window as any)['require'] !== 'undefined' && this.getScript();
    }

    // lazy load the ArcGIS API for JavaScript
    load(options?: Object): Promise<Function> {
        return new Promise((resolve: Function, reject: Function) => {
            // don't try to load a second time
            if (this.isLoaded()) {
                resolve(this.dojoRequire);
            }
            // wrap bootstrap in a promise
            this.bootstrap((err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.dojoRequire);
                }
            }, options);
        });
    }

    // wrap Dojo require in a promise
    loadModules(moduleNames: string[]): Promise<any[]> {
        return new Promise((resolve: Function) => {
            this.dojoRequire(moduleNames, (...modules: any[]) => {
                resolve(modules);
            });
        });
    }

    // convenience function to allow calling Dojo require w/ callback
    require(moduleNames: string[], callback: () => void) {
        return this.dojoRequire(moduleNames, callback);
    }
}