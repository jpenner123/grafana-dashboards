const moment = require('moment');
const I = actor();
const assert = require('assert');
module.exports = {
  url: 'graph/d/pmm-qan/pmm-query-analytics',
  filterGroups: [
    'Environment',
    'Cluster',
    'Replication Set',
    'Database',
    'Node Name',
    'Service Name',
    'User Name',
    'Node Type',
    'Service Type',
  ],
  tableHeader: ['Query', 'Load', 'Query Count', 'Query Time'],
  tabs: {
    tablesTab: ["//div[@class='card-body']//pre", "//button[@id='copyQueryExample']"],
    explainTab: ["//div[@id='classicPanel']//span"],
  },
  serverList: ['PMM Server PostgreSQL', 'PGSQL_', 'PXC_NODE', 'mysql'],
  fields: {
    table: '//table//tr[2]',
    detailsTable: '//app-details-table//app-details-row[1]',
    filter: "//app-qan-filter//div[@class='ps-content']",
    filterCheckboxSelector: '#query-analytics-filters input[type="checkbox"]',
    search: '//app-qan-search//input',
    pagination: "//ul[@role='navigation']",
    nextPageNavigation: "//ul[@role='navigation']//li[last()]",
    previousPageNavigation: "//ul[@role='navigation']//li[1]",
    pmmImage: '//footer/img',
    pmmVersion: '//footer/small',
    paginationArrow: "(//ul[@class='ngx-pagination']/li)[last()]",
    addColumn: "//button[@class='add-column-btn']",
    total: "//span[contains(text(), 'TOTAL')]",
    columns: '//tbody//app-qan-table-header-cell',
    fifty: "//div[@id='ad0800a556c8']/span",
    hundred: "//div[@id='a305c6a9fc9e']",
    iframe: "//div[@class='panel-content']//iframe",
    filterSelection: "(//div[@class='chips']//button)",
    resultsPerPageDropDown: "//div[@class='results-per-page']/ng-select",
    tablesTabInDetails: "//a[@id='tables']",
    explainTabInDetails: "//a[@id='explain']",
    classicSectionContents: "//div[@id='classicPanel']//span",
    tablesTabContents: "//div[@class='card-body']//pre",
    copyQueryButton: "//button[@id='copyQueryExample']",
    spinnerLocator: "//i[@class='fa fa-spinner fa-spin spinner']",
    newQANPanelContent: '.panel-content',
    countOfItems: "//div[@id='query-analytics-data']/div/div[2]/div/div[1]/div/div[2]/div/span",
    resetAll: 'button#reset-all-filters',
    newQANSpinnerLocator: "//i[@class='fa fa-spinner fa-spin spinner ant-spin-dot']",
    showSelected: "//div[@id='query-analytics-filters']/div/div/form/div/div[1]/button[1]",
    filterBy: "//input[@class='ant-input']",
    filterCheckboxes: '.checkbox-container__checkmark',
    newQANAddColumn: "//span[contains(text(), 'Add column')]",
    newQANMetricDropDown: '.ant-select-dropdown-menu-item',
    newQANColumnSearchField: "div[style*='display: block;'] input"
    groupBySelector: '.group-by-selector',
    addColumnSelector: '.add-columns-selector',
    manageColumnsSelector: '.manage-columns-selector',
    removeColumnButton: "//div[text()='Remove column']",
  },
  elements: {
    addColumnFirstElementSelector: 'ul.ant-select-dropdown-menu li:first-child',
    metricTooltip: '.ant-tooltip-content',
    latencyChart: '.latency-chart-container',
    resetAllButton: '#reset-all-filters',
    timeRangePickerButton: '.time-picker-button-select',
    selectedOverviewRow: 'tr.selected-overview-row',
    detailsSection: '#query-analytics-details',
    tableRowSelector: '.ant-table-scroll .ant-table-tbody tr:first-of-type .overview-main-column div',
    qpsTooltipValueSelector: '[data-qa="metrics-list"] [data-qa="qps"] span',
    spinBlur: 'div.ant-spin-blur',
    spinner: 'i.fa-spinner',
  },
  requests: {
    getReportPath: '/v0/qan/GetReport',
    getFiltersPath: '/v0/qan/Filters/Get',
  },
  filterGroupLocator(filterName) {
    return "//div[@class='filter-group__title']//span[contains(text(), '" + filterName + "')]";
  },

  tableHeaderLocator(tableHeader) {
    return "//ng-select//span[contains(@class, 'ng-value-label') and contains(text(), '" + tableHeader + "')]";
    return (
      "//ng-select//span[contains(@class, 'ng-value-label') and contains(text(), '" + tableHeader + "')]"
    );
  },

  tableHeaderColumnLocator(columnHeader) {
    return `(//span[@class='ant-table-header-column'])//span[contains(text(), '${columnHeader}')]`;
  },

  filterGroupCountSelector(groupName) {
    return (
      "//section[@class='aside__filter-group']//span[contains(text(), '" +
      groupName +
      "')]/../button[contains(text(), 'See all')]"
    );
  },

  overviewMetricCellValueLocator(rowNumber, dataColumnNumber) {
    return `.ant-table-tbody tr:nth-child(${rowNumber}) td:nth-child(${dataColumnNumber + 2}) .summarize`;
  },

  overviewMetricSortingLocator(сolumnNumber) {
    return `th.ant-table-column-has-actions:nth-child(${сolumnNumber + 2}) div[title="Sort"]`;
  },

  mainMetricGraphLocator(rowNumber) {
    return `.ant-table-tbody tr:nth-child(${rowNumber}) .d3-bar-chart-container`;
  },

  manageColumnLocator(columnName) {
    return `//span[text()='${columnName}']`;
  },

  overviewRowLocator(rowNumber) {
    return `.table-wrapper .ant-table-content tr[data-row-key="${rowNumber}"]`;
  },

  waitForQANPageLoaded() {
    I.waitForVisible(this.fields.table, 30);
    I.waitForClickable(this.fields.nextPageNavigation, 30);
  },

  waitForDownloadOverviewTable() {
    this.waitForResponsePath(this.requests.getReportPath);
    I.waitForInvisible(this.elements.spinBlur, 30);
    I.dontSeeElement(this.elements.spinner);
  },

  waitForResponsePath(path) {
    I.waitForResponse(request => {
      const url = require('url');
      const { pathname } = url.parse(request.url(), true);
      return path === pathname;
    }, 10);
  },

  async verifyFiltersSectionIsPresent() {
    I.waitForElement(this.fields.filterCheckboxSelector, 30);
    I.seeElement(this.fields.filterCheckboxSelector);
  },
  async verifyColumnIsNotAvailable(columnName) {
    I.click(this.fields.addColumnSelector);
    I.dontSeeElement(`//ul/li[@label='${columnName}']`);
  },
  async verifySelectedPageIs(pageNumber) {
    I.seeElement(`.ant-pagination-item-active[title="${pageNumber}"]`);
  },
  async verifyMetricsMatch(rowNumber, dataColumnNumber) {
    const cellSelector = this.overviewMetricCellValueLocator(rowNumber, dataColumnNumber);

    this.showTooltip(rowNumber, dataColumnNumber);
    let qpsMetricValue = await I.grabTextFrom(cellSelector);
    let qpsTooltipValue = await I.grabTextFrom(this.qpsTooltipValueSelector);
    assert.equal(qpsMetricValue.replace(/[^0-9.]/g, ''), qpsTooltipValue.replace(/[^0-9.]/g, ''));
  },

  async verifyColumnIsPresent(columnName) {
    const columnSelector = this.manageColumnLocator(columnName);
    I.seeElement(columnSelector);
  },

  async verifyColumnIsNotPresent(columnName) {
    const columnSelector = this.manageColumnLocator(columnName);
    I.dontSeeElement(columnSelector);
  },

  async verifyColumnIsNotRemovable(columnName) {
    this.openMetricsSelect(columnName);
    I.dontSeeElement(this.fields.removeColumnButton, 30);
  },
  async verifyRowIsSelected(rowNumber) {
    const rowSelector = this.overviewRowLocator(rowNumber);
    I.seeCssPropertiesOnElements(`${rowSelector}.selected-overview-row`, {'background-color': "rgb(35, 70, 130)"});
  },

  changeGroupBy(groupBy = 'Client Host') {
    I.waitForElement(this.fields.groupBySelector, 30);
    I.forceClick(this.fields.groupBySelector);
    I.click(`//ul/li[@label='${groupBy}']`);
  },
  verifyGroupByIs(groupBy) {
    I.waitForElement(`[data-qa="group-by"] [title="${groupBy}"]`, 30);
    I.seeElement(`[data-qa="group-by"] [title="${groupBy}"]`);
  },
  changeSorting(columnNumber, sortDirection = 'down') {
    const sortingBlockSelector = this.overviewMetricSortingLocator(columnNumber);
    I.waitForElement(sortingBlockSelector, 30);
    I.scrollTo(sortingBlockSelector);
    I.forceClick(sortingBlockSelector);
    if (sortDirection === 'up') {
      I.wait(5);
      I.forceClick(sortingBlockSelector);
    }
    I.wait(5);
  },
  verifySortingIs(columnNumber, sortDirection) {
    const sortingBlockSelector = this.overviewMetricSortingLocator(columnNumber);
    switch (sortDirection) {
      case 'up':
        I.seeElement(`${sortingBlockSelector} i[aria-label="icon: caret-up"].on`);
        break;
      case 'down':
        I.seeElement(`${sortingBlockSelector} i[aria-label="icon: caret-down"].on`);
        break;
      case '':
        I.dontSeeElement(`${sortingBlockSelector} i[aria-label="icon: caret-up"].on`);
        I.dontSeeElement(`${sortingBlockSelector} i[aria-label="icon: caret-down"].on`);
        break;
    }
  },
  addColumn(columnName) {
    I.waitForElement(this.fields.addColumnSelector, 30);
    I.click(this.fields.addColumnSelector);
    I.click(`//ul/li[@label='${columnName}']`);
    this.waitForDownloadOverviewTable();
  },
  changeColumn(oldColumnName, columnName) {
    const oldColumnSelector = `//span[text()='${oldColumnName}']`;
    const newColumnSelector = `//li[text()='${columnName}']`;
    I.waitForElement(oldColumnSelector, 30);
    I.click(oldColumnSelector);
    I.waitForElement(newColumnSelector, 30);
    I.click(newColumnSelector);
    this.waitForDownloadOverviewTable();
  },
  removeColumn(columnName) {
    this.openMetricsSelect(columnName);
    I.waitForElement(this.fields.removeColumnButton, 30);
    I.click(this.fields.removeColumnButton);
    this.waitForDownloadOverviewTable();
  },
  async searchFilters(searchString) {
    I.waitForElement(`//input[@placeholder='Filters search...']`, 30);
    I.fillField(`//input[@placeholder='Filters search...']`, searchString);
  },
  async checkFiltersMatchSearch(searchString) {
    const remainingFilters = await I.grabTextFrom('.checkbox-container__label-text');
    assert.equal(
      remainingFilters.every(filter => filter.includes(searchString)),
      true,
      `Remain only correct filters`
    );
  },
  async searchMetrics(searchString) {
    I.waitForElement('.ant-select-open', 30);
    I.fillField('.ant-select-open input', searchString);
  },
  async checkMetricsListMatchesSearch(searchString) {
    const remainingMetrics = await I.grabTextFrom('.ant-select-dropdown-menu-item');
    assert.equal(
        remainingMetrics.every(filter => filter.includes(searchString)),
        true,
        `Remain only correct metrics`
    );
  },
  openMetricsSelect(columnName){
    const columnSelector = this.manageColumnLocator(columnName);
    I.waitForElement(columnSelector, 30);
    I.click(columnSelector);
  },

  async getSelectedFilters() {
    const selectedFilters = `//div[@class='overview-filters']//input[@type='checkbox'][@value='']/following-sibling::span`;
    I.waitForElement(`//div[@class='overview-filters']//input[@type='checkbox']`, 30);
    const remainingFilters = await I.grabTextFrom(selectedFilters);
    console.log(remainingFilters);
  },
  async getMainMetricGraphValue(graphSelector, xInPercent) {
    const axisSelector = `${graphSelector} .axis`;
    I.waitForElement(axisSelector, 30);
    I.scrollTo(axisSelector, xInPercent, 0);
    I.moveCursorTo(axisSelector, xInPercent, 0);
    const tooltipStringValue = await I.grabAttributeFrom(graphSelector, 'data-tooltip');
    return tooltipStringValue.substr(-19, 19);
  },
  async getTimestamp(dateTime) {
    return moment(dateTime).format('x');
  },
  async verifyChronologicalOrderDateTime(dateTimeBefore, dateTimeAfter) {
    const timestampBefore = await this.getTimestamp(dateTimeBefore);
    const timestampAfter = await this.getTimestamp(dateTimeAfter);
    assert.equal(timestampAfter > timestampBefore, true);
  },
  resetAllFilters() {
    I.waitForElement(this.elements.resetAllButton, 30);
    I.click(this.elements.resetAllButton);
  },
  selectFilter(filterCheckboxSelector) {
    I.waitForElement(filterCheckboxSelector, 30);
    I.checkOption(filterCheckboxSelector);
    this.waitForResponsePath(this.requests.getFiltersPath);
  },
  selectRow(rowNumber) {
    const rowSelector = this.overviewRowLocator(rowNumber);
    I.waitForElement(rowSelector, 60);
    I.forceClick(rowSelector);
    this.waitForDownloadOverviewTable();
  },
  paginationGoNext() {
    I.waitForElement(`//li[@title='Next Page']`, 30);
    I.click(`//li[@title='Next Page']`);
  },
  paginationGoPrevious() {
    I.waitForElement(`//li[@title='Previous Page']`, 30);
    I.click(`//li[@title='Previous Page']`);
  },
  paginationGoLast() {},
  paginationGoFirst() {},
  selectTableRow(rowNumber) {
    const rowSelector = `//tr[@data-row-key='${rowNumber}']`;
    I.waitForElement(rowSelector, 30);
    I.click(rowSelector);
  },
  paginationGoTo(pageNumber) {
    const pageSelector = `.ant-pagination-item[title = '${pageNumber}']`;
    I.waitForElement(pageSelector, 30);
    I.click(pageSelector);
  },
  showTooltip(rowNumber, dataColumnNumber) {
    const tooltipSelector = this.overviewMetricCellValueLocator(rowNumber, dataColumnNumber);
    I.waitForElement(tooltipSelector, 30);
    I.scrollTo(tooltipSelector);
    I.moveCursorTo(tooltipSelector);
    I.waitForElement(this.elements.metricTooltip, 5);
    I.seeElement(this.elements.metricTooltip);
  },
  selectDetailsTab(tabName) {
    const tabSelector = `//div[@role='tab']/span[text()='${tabName}']`;
    I.waitForElement(tabSelector, 30);
    I.click(tabSelector);
  }

  waitForNewQANPageLoaded() {
    I.waitForElement(this.fields.newQANPanelContent, 30);
    I.waitForInvisible(this.fields.newQANSpinnerLocator, 30);
  },

  applyFilterNewQAN(filterName) {
    const filterToAplly = `//span[contains(@class, 'checkbox-container__label-text') and contains(text(), '${filterName}')]`;
    I.waitForVisible(filterToAplly, 20);
    I.click(filterToAplly);
  },

  async getCountOfItems() {
    return await I.grabTextFrom(this.fields.countOfItems);
  },

  verifyChangedCount(countBefore, countAfter) {
    assert.notEqual(countAfter, countBefore, 'Data should be changed');
  },

  async verifyFiltersSection(filterSection, expectedCount) {
    const countOfFiltersInSection = await I.grabNumberOfVisibleElements(
      `//span[contains(text(), '${filterSection}')]/parent::p/following-sibling::div/span/label[contains(@class, 'checkbox-container checkbox-container--main')]`
    );
    assert.equal(countOfFiltersInSection, expectedCount, `There should be '${expectedCount}' visible links`);
  },

  async getCountOfFilters(filterSection) {
    const showAllLink = `//span[contains(text(), '${filterSection}')]/following-sibling::span[contains(text(), 'Show all')]`;
    const showAllCount = await I.grabTextFrom(showAllLink);
    const count = showAllCount.slice(10, 12);
    return count;
  },

  applyShowAllLink(filterSection) {
    const showAllLink = `//span[contains(text(), '${filterSection}')]/following-sibling::span[contains(text(), 'Show all')]`;
    I.waitForVisible(showAllLink, 30);
    I.click(showAllLink);
  },

  async applyShowTop5Link(filterSection) {
    const showTop5Link = `//span[contains(text(), '${filterSection}')]/following-sibling::span[contains(text(), 'Show top 5')]`;
    I.waitForVisible(showTop5Link, 30);
    const top5Link = await I.grabTextFrom(showTop5Link);
    assert.equal(top5Link, 'Show top 5', 'Link is not correct');
    I.click(showTop5Link);
  },

  async verifyCountOfFilterLinks(expectedCount, before) {
    const count = await I.grabNumberOfVisibleElements(this.fields.filterCheckboxes);
    if (!before) {
      assert.equal(count, expectedCount);
    }
    if (before) {
      assert.notEqual(count, expectedCount);
    }
  },
};
