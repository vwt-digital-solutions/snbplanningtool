import { browser, protractor, by, element } from 'protractor';
const request = require('request'); // eslint-disable-line @typescript-eslint/no-var-requires

describe('SnB Planning Tool', () => {
  it('should authenticate', () => {
    browser.ignoreSynchronization = true;
    const requestOptions = {
      method: 'GET',
      url: browser.params.login.loginUrl,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      /* eslint-disable */
      form: {
        grant_type: 'client_credentials',
        client_id: browser.params.login.clientId,
        client_secret: browser.params.login.clientSecret,
        scope: browser.params.login.scope
      }
      /* eslint-enable */
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
      url: browser.params.apiUrl + '/cars',
      headers: {
        Authorization: 'Bearer ' + browser.params.login.accessToken
      }
    };

    const get = (options: any): any => {
      const defer = protractor.promise.defer();

      request(options, (error, message) => {
        if (error || message.statusCode >= 400) {
          defer.reject(message);
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

  it('should load the map and create clusters', () => {
    browser.get('/');
    browser.sleep(15000);

    const clusters = element.all(by.css('.cluster')).count();
    expect(clusters).toBeGreaterThan(0);
  });

  it('should show more than 0 workItem rows', () => {
    browser.get('/werk');
    const workRows = browser.driver.wait(() => element.all(by.css('.ag-row')).count());
    workRows.then(rows => {
      expect(rows).toBeGreaterThan(0);
    });
  });

  it('should show more than 0 carInfo rows', () => {
    browser.get('/autos');

    const carRows = browser.driver.wait(() => element.all(by.css('.ag-row')).count());
    carRows.then(rows => {
      expect(rows).toBeGreaterThan(0);
    });
  });

  it('should edit first carInfo row to "Lasser"', () => {
    browser.get('/autos');
    browser.sleep(2000);

    let firstRow = element.all(by.css('.ag-row:first-child'));
    let firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
    let firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_skill"]'));

    firstRowTokenColumn.getText().then((text) => {
      browser.params.carInfoRow.token = text[0];
    });
    firstRowDriverColumn.getText().then((text) => {
      browser.params.carInfoRow.driverSkill = text[0];
    });

    browser.actions().mouseMove(firstRowDriverColumn);
    firstRowDriverColumn.click();
    browser.sleep(200);
    browser.actions().sendKeys(protractor.Key.RETURN, protractor.Key.ARROW_DOWN, protractor.Key.RETURN).perform();

    element(by.css('button.save')).click();
    browser.sleep(5000);

    browser.refresh();
    browser.sleep(2000);

    firstRow = element.all(by.css('.ag-row:first-child'));
    firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
    firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_skill"]'));

    firstRowTokenColumn.getText().then((text) => {
      expect(text[0]).toContain(browser.params.carInfoRow.token);
    });

    firstRowDriverColumn.getText().then((text) => {
      expect([
        'Lasser',
        'Metende',
        'Leerling',
        'Kraanmachinist',
        'Overig',
        'NLS',
        'Cluster'
      ]).toContain(text[0]);
    });
  });

  it('should revert first carInfo row back to original driver_skill', () => {
    browser.get('/autos');
    browser.sleep(2000);

    let firstRow = element.all(by.css('.ag-row:first-child'));
    let firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
    let firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_skill"]'));

    browser.actions().mouseMove(firstRowDriverColumn);
    firstRowDriverColumn.click();
    browser.sleep(200);
    browser.actions().sendKeys(protractor.Key.RETURN, protractor.Key.UP, protractor.Key.RETURN).perform();

    element(by.css('button.save')).click();
    browser.sleep(3000);

    // REFRESHING BROWSER
    browser.executeScript('window.localStorage.clear();');
    browser.refresh();
    browser.sleep(2000);

    firstRow = element.all(by.css('.ag-row:first-child'));
    firstRowTokenColumn = firstRow.all(by.css('.ag-cell[col-id*="token"]'));
    firstRowDriverColumn = firstRow.all(by.css('.ag-cell[col-id*="driver_skill"]'));

    firstRowTokenColumn.getText().then((text) => {
      expect(text[0]).toContain(browser.params.carInfoRow.token);
    });
    firstRowDriverColumn.getText().then((text) => {
      expect(text[0]).toContain(browser.params.carInfoRow.driverName);
    });
  });

  it('should have more than 0 markers on the map after clicking the work-item link', () => {

    browser.get('/werk');
    browser.sleep(5000);

    const workItemLink = element.all(by.css('.work-item-view-link')).first();

    browser.wait(protractor.ExpectedConditions.presenceOf(workItemLink));

    workItemLink.click();

    const workMarkers = element.all(by.css('.work-marker'));

    browser.wait(protractor.ExpectedConditions.presenceOf(workMarkers.first()));
    browser.sleep(1000);

    const displayedMarkers = workMarkers.filter((elem) => {
      return elem.isDisplayed();
    });

    displayedMarkers.count().then(elements => {
      expect(elements).toBeGreaterThan(0);
    });
  });

});
