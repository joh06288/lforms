var tp = require('./lforms_testpage.po.js');

describe('Visual effect tests', function() {

  describe('Active field background color', function() {
    var color;
    beforeAll(function(done) {
      // Get the backgound color of the empty data type field
      tp.openFullFeaturedForm();
      let emptyField = element(by.id("/type0/1"));
      emptyField.click();
      emptyField.getCssValue("background-color").then(function(c) {
        color = c;
        done();
      });
    });

    let dataTypes = ['BL', 'INT', 'REAL', 'ST', 'BIN', 'DT', 'DTM','TM', 'CNE', 'CWE',
      'RTO', 'QTY', 'YEAR', 'MONTH', 'DAY', 'URL', 'EMAIL', 'PHONE', 'TX'];
    for (let i=0, len=dataTypes.length; i<len; ++i) {
      let d = dataTypes[i];
      let otherField = element(by.id('/type'+(i+1)+'/1'));
      // Active field background color should the be same for all types of fields
      it('should be the same for data type '+d, (function(field) {
        return function(done) {
          field.click();
          field.getCssValue('background-color').then(bgColor => {
            field.getAttribute('id').then(fieldID => {
              expect(bgColor).toBe(color);
              if (bgColor != color) {
                // diagnostic output
                console.log('Unexpected color for field ID '+fieldID + ';  data type: '+d);
              }
              done();
            });
          });
        }
      })(otherField));
    }
  });


  // Units columns
  describe('Hiding and showing Units column ', function() {

    it('should be able to dynamically hide and show Units column in the table template', function () {

      var unitsCol = element(by.id("th_Units"));
      tp.openFullFeaturedForm();

      // units column is shown
      expect(unitsCol.isDisplayed()).toBe(true);
      // hide the units column
      element(by.id("toggle-units-col")).click();
      expect(unitsCol.isPresent()).toBe(false);
      // show it again
      element(by.id("toggle-units-col")).click();
      expect(unitsCol.isDisplayed()).toBe(true);

      // open another form
      tp.openFormWithUserData();
      // units column is shown
      expect(unitsCol.isDisplayed()).toBe(true);
      // hide the units column
      element(by.id("toggle-units-col")).click();
      expect(unitsCol.isPresent()).toBe(false);
      // show it again
      element(by.id("toggle-units-col")).click();
      expect(unitsCol.isDisplayed()).toBe(true);
    });

    it('should not show the units column if there are no units in the form data', function () {
      var unitsCol = element(by.id("th_Units"));
      tp.openValidationTest();
      expect(unitsCol.isPresent()).toBe(false);
    });

  });


  describe('Change fields in form header ', function() {

    it('should be able to dynamically change form header fields', function () {

      tp.openFullFeaturedForm();
      var comment =element(by.id("comment"));
      var timeDone =element(by.id("time_done"));
      var dateDone =element(by.id("date_done"));
      var whereDone =element(by.id("where_done"));

      expect(comment.isDisplayed()).toBe(true);
      expect(timeDone.isDisplayed()).toBe(true);
      expect(dateDone.isDisplayed()).toBe(true);
      expect(whereDone.isDisplayed()).toBe(true);

      element(by.id("change-columns")).click();

      // obr has only two fields
      expect(comment.isPresent()).toBe(false);
      expect(timeDone.isPresent()).toBe(false);
      expect(dateDone.isDisplayed()).toBe(true);
      expect(whereDone.isDisplayed()).toBe(true);
    });

  });

  describe('Links on question codes', function() {

    it('should show a link on LOINC typed question code and no links for non-LOINC typed question codes.', function () {
      tp.openFullFeaturedForm();
      browser.wait(function() {
        return element(by.id('/type0/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);

      var codeCheckbox = tp.checkboxesFinder.get(0);
      codeCheckbox.click();

      var titleCode = element(by.css(".lf-form-title .lf-item-code span"));
      var titleCodeLink = element(by.css(".lf-form-title .lf-item-code a"));
      expect(titleCode.getText()).toBe("[all-in-one]");
      // form's code should not have a link
      expect(titleCodeLink.isPresent()).toBe(false);

      var itemCodeLink0 = element.all(by.css(".lf-de-label .lf-item-code a")).get(0);
      // should have a link
      expect(itemCodeLink0.getText()).toBe("[type0]");
      var itemCode1 = element.all(by.css(".lf-de-label .lf-item-code span")).get(0);
      // should not have a link
      expect(itemCode1.getText()).toBe("[q_lg]");
    });

  });


  describe('Question/section in question', function() {

    it('should all the questions/sections defined in the question-in-question form', function () {
      tp.openQuestionInQuestionForm();
      browser.wait(function() {
        return element(by.id('/q1/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);

      expect(element(by.id('/q1/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q1/q11/1/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q1/q12/1/1')).isDisplayed()).toBe(true);

      expect(element(by.id('/q2/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q2/q21/1/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q2/q22/q221/1/1/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q2/q22/q222/1/1/1')).isDisplayed()).toBe(true);

      expect(element(by.id('/q3/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q3/q31/1/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q3/q32/q321/1/1/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q3/q32/q322/1/1/1')).isDisplayed()).toBe(true);

      element(by.id('add-/q3/q31/1/1')).click();
      expect(element(by.id('/q3/q31/1/2')).isDisplayed()).toBe(true);

      element(by.id('add-/q3/q32/1/1')).click();
      expect(element(by.id('/q3/q32/q321/1/2/1')).isDisplayed()).toBe(true);
      expect(element(by.id('/q3/q32/q322/1/2/1')).isDisplayed()).toBe(true);

    });

  });


  describe('Responsive display layout', function() {

    it('container should have different css class on different size', function () {
      tp.openFullFeaturedForm();
      browser.wait(function() {
        return element(by.id('/type0/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);


      // break points, 600 //800
      browser.executeScript('jQuery(".lf-form-view").width(601)').then(function(){
        element(by.css(".lf-form-view")).getSize().then(function(eleSize){
          expect(eleSize.width).toEqual(601);
        });
        expect(element(by.css(".lf-form-view.lf-view-lg")).isPresent()).toBe(true);
        expect(element(by.css(".lf-form-view.lf-view-md")).isPresent()).toBe(false);
        expect(element(by.css(".lf-form-view.lf-view-sm")).isPresent()).toBe(false);

        expect(element.all(by.css(".data-row.lf-item-view-lg")).first().element(by.id("/q_lg/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-md")).first().element(by.id("/q_md/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).first().element(by.id("/q_sm/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-lg")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-md")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
      });


      browser.executeScript('jQuery(".lf-form-view").width(598)').then(function(){
        element(by.css(".lf-form-view")).getSize().then(function(eleSize){
          console.log('element size: '+JSON.stringify(eleSize));
          expect(eleSize.width).toEqual(598);
        });
        expect(element(by.css(".lf-form-view.lf-view-lg")).isPresent()).toBe(false);
        expect(element(by.css(".lf-form-view.lf-view-md")).isPresent()).toBe(true);
        expect(element(by.css(".lf-form-view.lf-view-sm")).isPresent()).toBe(false);

        // check 4 questions
        expect(element.all(by.css(".data-row.lf-item-view-lg")).first().element(by.id("/q_lg/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-md")).first().element(by.id("/q_md/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).first().element(by.id("/q_sm/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-lg")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
        expect(element.all(by.css(".data-row.lf-item-view-md")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
      });

      // break points, 400 //480
      browser.executeScript('jQuery(".lf-form-view").width(398)').then(function(){
        element(by.css(".lf-form-view")).getSize().then(function(eleSize){
          console.log('element size: '+JSON.stringify(eleSize));
          expect(eleSize.width).toEqual(398);
        });
        expect(element(by.css(".lf-form-view.lf-view-lg")).isPresent()).toBe(false);
        expect(element(by.css(".lf-form-view.lf-view-md")).isPresent()).toBe(false);
        expect(element(by.css(".lf-form-view.lf-view-sm")).isPresent()).toBe(true);

        // check 4 questions
        expect(element.all(by.css(".data-row.lf-item-view-lg")).first().element(by.id("/q_lg/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-md")).first().element(by.id("/q_md/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).first().element(by.id("/q_sm/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-lg")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
        expect(element.all(by.css(".data-row.lf-item-view-md")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(true);
      });

      browser.executeScript('jQuery(".lf-form-view").width(401)').then(function(){
        element(by.css(".lf-form-view")).getSize().then(function(eleSize){
          console.log('element size: '+JSON.stringify(eleSize));
          expect(eleSize.width).toEqual(401);
        });
        expect(element(by.css(".lf-form-view.lf-view-lg")).isPresent()).toBe(false);
        expect(element(by.css(".lf-form-view.lf-view-md")).isPresent()).toBe(true);
        expect(element(by.css(".lf-form-view.lf-view-sm")).isPresent()).toBe(false);

        // check 4 questions
        expect(element.all(by.css(".data-row.lf-item-view-lg")).first().element(by.id("/q_lg/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-md")).first().element(by.id("/q_md/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).first().element(by.id("/q_sm/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-lg")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);
        expect(element.all(by.css(".data-row.lf-item-view-md")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(true);
        expect(element.all(by.css(".data-row.lf-item-view-sm")).get(1).element(by.id("/q_auto/1")).isPresent()).toBe(false);

      });
    });
  });

  describe('displayControl.colCSS in formHeaderItems', function() {

    it('displayControl.colCSS in formHeaderItems should work in lg view mode', function () {
      tp.openFullFeaturedForm();
      browser.wait(function () {
        return element(by.id('/type0/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);

      // break points, 600 //800
      browser.executeScript('jQuery(".lf-form-view").width(601)').then(function () {
        element(by.css(".lf-form-view")).getSize().then(function (eleSize) {
          expect(eleSize.width).toEqual(601);
        });
        expect(element.all(by.css(".lf-header-de")).first().getAttribute("style")).toBe("width: 10em; min-width: 4em;");
        expect(element.all(by.css(".lf-header-de")).first().getCssValue("min-width")).toBe("56px");
        expect(element.all(by.css(".lf-header-de")).get(1).getAttribute("style")).toBe("width: 12em; min-width: 4em;");
        expect(element.all(by.css(".lf-header-de")).get(2).getAttribute("style")).toBe("width: 30%; min-width: 4em;");
        expect(element.all(by.css(".lf-header-de")).get(3).getAttribute("style")).toBe("width: 70%; min-width: 4em;");
      });
    });

    it('displayControl.colCSS in formHeaderItems should not work in md or sm view mode', function () {
      tp.openFullFeaturedForm();
      browser.wait(function () {
        return element(by.id('/type0/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);

      // break points, 600 //800
      browser.executeScript('jQuery(".lf-form-view").width(598)').then(function () {
        element(by.css(".lf-form-view")).getSize().then(function (eleSize) {
          expect(eleSize.width).toEqual(598);
        });
        expect(element.all(by.css(".lf-header-de")).first().getAttribute("style")).toBe("");
        expect(element.all(by.css(".lf-header-de")).first().getCssValue("min-width")).toBe("auto"); // 0px on FF
        expect(element.all(by.css(".lf-header-de")).get(1).getAttribute("style")).toBe("");
        expect(element.all(by.css(".lf-header-de")).get(2).getAttribute("style")).toBe("");
        expect(element.all(by.css(".lf-header-de")).get(3).getAttribute("style")).toBe("");
      });

      // break points, 400 //480
      browser.executeScript('jQuery(".lf-form-view").width(398)').then(function () {
        element(by.css(".lf-form-view")).getSize().then(function (eleSize) {
          expect(eleSize.width).toEqual(398);
        });
        expect(element.all(by.css(".lf-header-de")).first().getAttribute("style")).toBe("");
        expect(element.all(by.css(".lf-header-de")).first().getCssValue("min-width")).toBe("auto"); // 0px on FF
        expect(element.all(by.css(".lf-header-de")).get(1).getAttribute("style")).toBe("");
        expect(element.all(by.css(".lf-header-de")).get(2).getAttribute("style")).toBe("");
        expect(element.all(by.css(".lf-header-de")).get(3).getAttribute("style")).toBe("");
      });
    });
  });


  describe('displayControl.colCSS in horizontal table', function() {

    it('displayControl.colCSS should work for items in horizontal tables', function () {
      tp.openFullFeaturedForm();
      browser.wait(function () {
        return element(by.id('/type0/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);

      expect(element.all(by.css(".lf-form-horizontal-table col")).first().getAttribute("style")).toBe("width: 25%; min-width: 10%;");
      expect(element.all(by.css(".lf-form-horizontal-table col")).get(1).getAttribute("style")).toBe("width: 25%; min-width: 15%;");
      expect(element.all(by.css(".lf-form-horizontal-table col")).get(2).getAttribute("style")).toBe("width: 50%;");
    });
  });
});
