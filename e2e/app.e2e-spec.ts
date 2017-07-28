import { UVDisplayPage } from './app.po';

describe('uvdisplay App', () => {
  let page: UVDisplayPage;

  beforeEach(() => {
    page = new UVDisplayPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
