import { BashEmulatorPage } from './app.po';

describe('bash-emulator App', function() {
  let page: BashEmulatorPage;

  beforeEach(() => {
    page = new BashEmulatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
