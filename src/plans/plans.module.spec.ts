import { PlansModule } from './plans.module';

describe('PlansModule', () => {
  let plansModule: PlansModule;

  beforeEach(() => {
    plansModule = new PlansModule();
  });

  it('should create an instance', () => {
    expect(plansModule).toBeTruthy();
  });
});
