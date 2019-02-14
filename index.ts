
export interface IConfigurationStore {
  init(): Promise<IConfigurationStore>
  setGlobalData<T>(key: string, value: T): Promise<T>
  getGlobalData<T>(key: string, defaultValue?: T): Promise<T>
  setUserData<T>(key: string, value: T): Promise<T>
  getUserData<T>(key: string, defaultValue?: T): Promise<T>
}

export abstract class BaseConfigurationStore implements IConfigurationStore {
  constructor(public userID: string, private globalPath = 'internal/global/', private userPath = 'internal/user/') {}

  protected abstract setData<T>(settingsPath: string, value: T): Promise<T>;
  protected abstract getData<T>(settingsPath: string, defaultValue?: T): Promise<T>;
  public abstract init(): Promise<IConfigurationStore>;

  private getGlobalSettingsPath(key: string): string {
    return `${this.globalPath}${key}`
  }

  private getUserSettingsPath(key: string): string {
    return `${this.userPath}${this.userID}/${key}`
  }

  setGlobalData<T>(key: string, value: T): Promise<T> {
    return this.setData<T>(this.getGlobalSettingsPath(key), value)
  }

  getGlobalData<T>(key: string, defaultValue?: T): Promise<T> {
    return this.getData<T>(this.getGlobalSettingsPath(key), defaultValue)
  }

  setUserData<T>(key: string, value: T): Promise<T> {
    return this.setData<T>(this.getUserSettingsPath(key), value)
  }

  getUserData<T>(key: string, defaultValue?: T): Promise<T> {
    return this.getData<T>(this.getUserSettingsPath(key), defaultValue)
  }
}
