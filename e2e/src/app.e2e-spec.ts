import { browser, protractor, by, element } from "protractor";
var request = require('request');

describe("SnB Planning Tool", function() {
    it("should authenticate", function() {
      browser.ignoreSynchronization = true;
      var requestOptions = {
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

      function get(options) {
        var defer = protractor.promise.defer();

        request(options, function (error, message) {
          if (error || message.statusCode >= 400) {
            defer.reject({
              error : error,
              message : message
            });
          } else {
            defer.fulfill(message);
          }
        });
        return defer.promise;
      }

      function setupCommon() {
        return get(requestOptions);
      }

      var flow = protractor.promise.controlFlow();
      flow.execute(setupCommon).then(function(response){
        var responseBody = JSON.parse(response['body']);
        browser.get('/auth/'+ JSON.stringify(responseBody));
      });

      browser.sleep(4000);
    });

    it("should show more than 0 car location(s)", function() {
      browser.get('/');
      browser.sleep(2000);

      var markerImages = element.all(by.css("img[src*='assets/images/car-location.png']")).count();
      expect(markerImages).toBeGreaterThan(0);
    });

    it("should show more than 0 carInfo rows", function() {
      browser.get('/cars');
      browser.sleep(2000);

      var carsRows = element.all(by.css(".ag-row")).count();
      expect(carsRows).toBeGreaterThan(0);
    });

    it("should edit carInfo row with token '161035' to 'Pietje Puk'", function() {
      browser.get('/cars');
      browser.sleep(2000);

      var firstRow = element.all(by.css(".ag-row:first-child")),
        firstRowTokenColumn = firstRow.all(by.css(".ag-cell[col-id*='token']")),
        firstRowDriverColumn = firstRow.all(by.css(".ag-cell[col-id*='driver_name']"));

      firstRowDriverColumn.click();
      browser.actions().sendKeys(protractor.Key.RETURN, "Pietje Puk", protractor.Key.RETURN).perform();

      element(by.css('button.save')).click();
      browser.sleep(3000);

      // REFRESHING BROWSER
      browser.executeScript('window.localStorage.clear();');
      browser.refresh();
      browser.sleep(2000);

      var firstRow = element.all(by.css(".ag-row:first-child")),
        firstRowTokenColumn = firstRow.all(by.css(".ag-cell[col-id*='token']")),
        firstRowDriverColumn = firstRow.all(by.css(".ag-cell[col-id*='driver_name']"));

      expect(firstRowTokenColumn.getText()).toContain('vwt/hyrde/token/161035');
      expect(firstRowDriverColumn.getText()).toContain('Pietje Puk');
    });

    it("should revert carInfo row with token '161035' back to 'Pascal van t End'", function() {
      browser.get('/cars');
      browser.sleep(2000);

      var firstRow = element.all(by.css(".ag-row:first-child")),
        firstRowTokenColumn = firstRow.all(by.css(".ag-cell[col-id*='token']")),
        firstRowDriverColumn = firstRow.all(by.css(".ag-cell[col-id*='driver_name']"));

      firstRowDriverColumn.click();
      browser.actions().sendKeys(protractor.Key.RETURN, "Pascal van t End", protractor.Key.RETURN).perform();

      element(by.css('button.save')).click();
      browser.sleep(3000);

      // REFRESHING BROWSER
      browser.executeScript('window.localStorage.clear();');
      browser.refresh();
      browser.sleep(2000);

      var firstRow = element.all(by.css(".ag-row:first-child")),
        firstRowTokenColumn = firstRow.all(by.css(".ag-cell[col-id*='token']")),
        firstRowDriverColumn = firstRow.all(by.css(".ag-cell[col-id*='driver_name']"));

      expect(firstRowTokenColumn.getText()).toContain('vwt/hyrde/token/161035');
      expect(firstRowDriverColumn.getText()).toContain('Pascal van t End');
    });

    it("should show more than 0 workItems rows", function() {
      browser.get('/work');
      browser.sleep(2000);

      var carsRows = element.all(by.css(".ag-row")).count();
      expect(carsRows).toBeGreaterThan(0);
    });
});
