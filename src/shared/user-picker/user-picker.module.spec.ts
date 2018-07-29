import { UserPickerModule } from './user-picker.module';

describe('UserPickerModule', () => {
  let userPickerModule: UserPickerModule;

  beforeEach(() => {
    userPickerModule = new UserPickerModule();
  });

  it('should create an instance', () => {
    expect(userPickerModule).toBeTruthy();
  });
});
