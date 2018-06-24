import { CadetModule } from './cadet.module';

describe('CadetModule', () => {
  let cadetModule: CadetModule;

  beforeEach(() => {
    cadetModule = new CadetModule();
  });

  it('should create an instance', () => {
    expect(cadetModule).toBeTruthy();
  });
});
