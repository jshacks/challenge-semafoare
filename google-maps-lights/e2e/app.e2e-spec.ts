import { GoogleMapsApiPage } from './app.po';

describe('google-maps-api App', function() {
  let page: GoogleMapsApiPage;

  beforeEach(() => {
    page = new GoogleMapsApiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
