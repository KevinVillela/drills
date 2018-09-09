import { RankingsModule } from './rankings.module';

describe('RankingsModule', () => {
  let rankingsModule: RankingsModule;

  beforeEach(() => {
    rankingsModule = new RankingsModule();
  });

  it('should create an instance', () => {
    expect(rankingsModule).toBeTruthy();
  });
});
