import { AnimatorModule } from './animator.module';

describe('AnimatorModule', () => {
  let animatorModule: AnimatorModule;

  beforeEach(() => {
    animatorModule = new AnimatorModule();
  });

  it('should create an instance', () => {
    expect(animatorModule).toBeTruthy();
  });
});
