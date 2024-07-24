import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsFrameworkService} from '../interface';
import {identity, of, throwError} from 'rxjs';
import {FrameworkServiceImpl} from './framework-service-impl';
import { CsFormService } from '../../form/interface/cs-form-service';
import { Form, Framework } from '../../../models';

describe('FrameworkServiceImpl', () => {
    let frameworkService: CsFrameworkService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockFormService: Partial<CsFormService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.framework.FRAMEWORK_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<CsFormService>(InjectionTokens.services.form.FORM_SERVICE).toConstantValue(mockFormService as CsFormService);

        container.bind<CsFrameworkService>(InjectionTokens.services.framework.FRAMEWORK_SERVICE).to(FrameworkServiceImpl).inSingletonScope();

        frameworkService = container.get<CsFrameworkService>(InjectionTokens.services.framework.FRAMEWORK_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(frameworkService).toBeTruthy();
    });

    describe('getFrameworks()', () => {
        it('should be able to get framework', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        response: []
                    }
                };
                return of(response);
            });

            frameworkService.getFramework('SOME_FRAMEWORK_ID', {requiredCategories: ['SOME_CATEGORY', 'SOME_CATEGORY_1']}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    parameters: {
                        categories: 'SOME_CATEGORY,SOME_CATEGORY_1'
                    }
                }));
                done();
            });
        });
    });

    describe('getFrameworkConfig()', () => {
        it('should be able fetch the framework config if framework category is available on frameworkConfig', (done) => {
            const sampleFrameWork: Framework = { name: "", identifier: "", categories: [{code: "SAMPLE_CODE", name: "SAMPLE_NAME", identifier:"SAMPLE_ID", description:"", index:1,status:""}]}
            frameworkService.getFrameworkConfig('SOME_FRAMEWORK_ID', {apiPath: "", framework: sampleFrameWork}).subscribe((response) => {
                expect(response).toBeDefined();
                done();
            });
        });

        it('should be able fetch the framework config if form config is available', (done) => {
            mockFormService.getForm = jest.fn(() => {
                const response = {
                    type: "",
                    subtype: "",
                    action: "",
                    component: "",
                    framework: "string",
                    data: {
                        templateName: "string",
                        action: "",
                        fields: [],
                    },
                    created_on: "",
                    last_modified_on: "",
                    rootOrgId: ""
                }
                return of(response as any);
            });
            frameworkService.getFrameworkConfig('SOME_FRAMEWORK_ID', {apiPath: ""}, {apiPath:"", params: {type: "SAMPLE_TYPE", subType:"SAMPLE_SUB_TYPE", action:"SAMPLE_ACTION"}}).subscribe((response) => {
                expect(response).toBeDefined();
                done();
            });
        });

        it('should be able fetch the framework config if form config is available', (done) => {
            const sampleFrameWork: Framework = { name: "", identifier: "", categories: [{code: "SAMPLE_CODE", name: "SAMPLE_NAME", identifier:"SAMPLE_ID", description:"", index:1,status:""}]}
            mockFormService.getForm = jest.fn(() => {
                const response = {
                    type: "",
                    subtype: "",
                    action: "",
                    component: "",
                    framework: "string",
                    data: {
                        templateName: "string",
                        action: "",
                        fields: [],
                    },
                    created_on: "",
                    last_modified_on: "",
                    rootOrgId: ""
                }
               return  throwError({} as any);
            });
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        framework: sampleFrameWork
                    }
                };
                return of(response);
            });
            frameworkService.getFrameworkConfig('SOME_FRAMEWORK_ID', {apiPath: ""}, {apiPath:"", params: {type: "SAMPLE_TYPE", subType:"SAMPLE_SUB_TYPE", action:"SAMPLE_ACTION"}}).subscribe((response) => {
                expect(response).toBeDefined();
                done();
            });
        });
    });
});
