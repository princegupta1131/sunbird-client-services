import {CsFormConfig, CsFrameworkConfig, CsFrameworkServiceConfig} from '../../../index';
import {Observable} from 'rxjs';
import {Framework} from '../../../models/channel';

export interface GetFrameworkOptions {
    requiredCategories: string[];
}

export interface FrameworkConfig {
    code: string;
    identifier: string;
    label: string;
    index: number,
    placeHolder: string,
    translations?: string;
}

export interface CsFrameworkService {

    getFramework(id: string, options?: GetFrameworkOptions, config?: CsFrameworkServiceConfig): Observable<Framework>;
    getFrameworkConfig(frameworkId: string, frameworkConfig?: CsFrameworkConfig, formConfig?: CsFormConfig): Observable<FrameworkConfig[] | Array<any>>;
    getFrameworkConfigMap(frameworkId: string, frameworkConfig?: CsFrameworkConfig, formConfig?: CsFormConfig): Observable<{
        [frameworkId: string]: any;
      }>;

}
