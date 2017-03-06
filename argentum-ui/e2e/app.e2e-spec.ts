import { ArgentumUiPage } from './app.po';

describe('argentum-ui App', () => {
  let page: ArgentumUiPage;

  beforeEach(() => {
    page = new ArgentumUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
