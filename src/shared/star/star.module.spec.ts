import { StarModule } from './star.module';

describe('StarModule', () => {
  let starModule: StarModule;

  beforeEach(() => {
    starModule = new StarModule();
  });

  it('should create an instance', () => {
    expect(starModule).toBeTruthy();
  });
});
