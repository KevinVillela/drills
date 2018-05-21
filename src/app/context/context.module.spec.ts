import { ContextModule } from './context.module';

describe('ContextModule', () => {
  let contextModule: ContextModule;

  beforeEach(() => {
    contextModule = new ContextModule();
  });

  it('should create an instance', () => {
    expect(contextModule).toBeTruthy();
  });
});
