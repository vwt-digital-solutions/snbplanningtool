import { browser, protractor, by, element } from 'protractor';
const request = require('request');

describe('SnB Planning Tool', () => {
    it('should authenticate', () => {
      browser.ignoreSynchronization = true;
      const requestOptions = {
        method: 'GET',
        url: browser.params.login.loginUrl,
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
          grant_type: 'client_credentials',
          client_id: browser.params.login.clientId,
          client_secret: browser.params.login.clientSecret,
          scope: browser.params.login.scope
        }
      };

      const get = (options: any): any => {
        const defer = protractor.promise.defer();

        request(options, (error, message) => {
          if (error || message.statusCode >= 400) {
            defer.reject({ error, message });
          } else {
            defer.fulfill(message);
          }
        });
        return defer.promise;
      };

      const setupCommon = (): any => {
        return get(requestOptions);
      };

      const flow = protractor.promise.controlFlow();
      flow.execute(setupCommon).then((response) => {
        const authBody = JSON.parse(response.body);
        browser.params.login.accessToken = authBody.access_token;
        browser.get('/auth/' + response.body);
      });
    });

    it('should connect to the API', () => {
      const requestOptions = {
        method: 'GET',
        url: browser.params.apiUrl,
        headers: {
          Authorization: 'Bearer ' + browser.params.login.accessToken
        }
      };

      const get = (options: any): any => {
        const defer = protractor.promise.defer();

        request(options, (error, message) => {
          if (error || message.statusCode >= 400) {
            defer.reject({ error, message });
          } else {
            defer.fulfill(message);
          }
        });
        return defer.promise;
      };

      const setupCommon = (): any => {
        return get(requestOptions);
      };

      const flow = protractor.promise.controlFlow();
      flow.execute(setupCommon).then((response) => {
        expect(response.statusMessage).toBe('OK');
      });
    });

    it('should show more than 0 location(s)', () => {
      browser.get('/');
      browser.sleep(30000);

      const mapContainer = element(by.css('.sebm-google-map-container'));
      const imageCount = mapContainer.all(by.tagName('agm-marker')).count();
      expect(imageCount).toBeGreaterThan(0);
    });

    it('should show more than 0 carInfo rows', () => {
      browser.get('/autos');
      browser.sleep(2000);

      const carsRows = element.all(by.css('.ag-row')).count();
      expect(carsRows).toBeGreaterThan(0);
    });

    it('should edit first carInfo row to "Pietje Puk"', () => {
      browser.get('/autos');
      browser.sleep(2000);

      let firstRow = element.all(by.css('.ag-row:first-child'));
      let firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
      let firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_name"]'));

      firstRowTokenColumn.getText().then(function (text) {
        browser.params.carInfoRow.token = text[0];
      });
      firstRowDriverColumn.getText().then(function (text) {
        browser.params.carInfoRow.driverName = text[0];
      });

      firstRowDriverColumn.click();
      browser.actions().sendKeys(protractor.Key.RETURN, 'Pietje Puk', protractor.Key.RETURN).perform();

      element(by.css('button.save')).click();
      browser.sleep(3000);

      browser.executeScript('window.localStorage.clear();');
      browser.refresh();
      browser.sleep(2000);

      firstRow = element.all(by.css('.ag-row:first-child'));
      firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
      firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_name"]'));

      firstRowTokenColumn.getText().then(function (text) {
        expect(text[0]).toContain(browser.params.carInfoRow.token);
      });
      firstRowDriverColumn.getText().then(function (text) {
        expect(text[0]).toContain('Pietje Puk');
      });
    });

    it('should revert first carInfo row back to original name', () => {
      browser.get('/autos');
      browser.sleep(2000);

      let firstRow = element.all(by.css('.ag-row:first-child'));
      let firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
      let firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_name"]'));

      firstRowDriverColumn.click();
      browser.actions().sendKeys(protractor.Key.RETURN, browser.params.carInfoRow.driverName, protractor.Key.RETURN).perform();

      element(by.css('button.save')).click();
      browser.sleep(3000);

      // REFRESHING BROWSER
      browser.executeScript('window.localStorage.clear();');
      browser.refresh();
      browser.sleep(2000);

      firstRow = element.all(by.css('.ag-row:first-child'));
      firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
      firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_name"]'));

      firstRowTokenColumn.getText().then(function (text) {
        expect(text[0]).toContain(browser.params.carInfoRow.token);
      });
      firstRowDriverColumn.getText().then(function (text) {
        expect(text[0]).toContain(browser.params.carInfoRow.driverName);
      });
    });

    it('should show more than 0 workItems rows', () => {
      browser.get('/werk');
      browser.sleep(20000);

      const carsRows = element.all(by.css('.ag-row')).count();
      expect(carsRows).toBeGreaterThan(0);
    });
});
