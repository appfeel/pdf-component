import { Config } from '@stencil/core';
import { angularOutputTarget as angular } from '@stencil/angular-output-target';
import { reactOutputTarget as react } from '@stencil/react-output-target';

export const config: Config = {
    namespace: 'pdf-component',
    outputTargets: [
        react({
            componentCorePackage: 'pdf-component',
            proxiesFile: '../pdf-component-react/src/components/stencil-generated/index.ts',
            includeDefineCustomElements: true,
        }),
        angular({
            componentCorePackage: `pdf-component`,
            directivesProxyFile: `../pdf-component-angular/projects/pdf-component/src/lib/stencil-generated/components.ts`
        }),
        {
            type: 'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'dist-custom-elements',
        },
        {
            type: 'docs-readme',
        },
        {
            type: 'www',
            serviceWorker: null, // disable service workers
        },
    ],
};
