import { FrameworkConfig } from '../interface';


export class CsFrameworkConfigBloc {
  private static _instance: CsFrameworkConfigBloc;

  static get instance(): CsFrameworkConfigBloc {
    if (!this._instance) {
      this._instance = new CsFrameworkConfigBloc();
    }

    return this._instance;
  }
  private categoryConfig: {
    [frameworkId: string]: Array<FrameworkConfig>;
  } = {};

  public get config() {
    return this.categoryConfig;
  }

  updateState(frameWorkId: string, config: Array<FrameworkConfig>) {
    this.categoryConfig[frameWorkId] = config;
  }

  dispose() {
    this.categoryConfig = {}
  }
}
