class ListLinks {
  constructor(
    color = 0,
    margin = 0,
    colSpan = 0,
    padding = 0,
    defaultButtonIsOutline = false,
    buttonSize = 0,
    headingWeight = 0
  ) {
    this.defaultColor = color;
    this.defaultMargin = margin;
    this.defaultColSpan = colSpan;
    this.defaultPadding = padding;
    this.defaultButtonIsOutline = defaultButtonIsOutline;
    this.defaultButtonSize = buttonSize;
    this.defaultHeadingWeight = headingWeight;
  }

  defaultColor = 0;
  defaultMargin = 0;
  defaultColSpan = 0;
  defaultPadding = 0;
  defaultButtonIsOutline = false;
  defaultButtonSize = 0;
  defaultHeadingWeight = 0;

  setDefaultColor(color) {
    this.defaultColor = color;
  }
  setDefaultMargin(margin) {
    this.defaultMargin = margin;
  }
  setDefaultColSpan(colSpan) {
    this.defaultColSpan = colSpan;
  }
  setDefaultPadding(padding) {
    this.defaultPadding = padding;
  }
  setDefaultButtonIsOutline(buttonIsOutline) {
    this.defaultButtonIsOutline = buttonIsOutline;
  }
  setDefaultButtonSize(buttonSize) {
    this.defaultButtonSize = buttonSize;
  }
  setDefaultHeadingWeight(headingWeight) {
    this.defaultHeadingWeight = headingWeight;
  }

  getButtonClass(baseClass, url) {
    baseClass += this.getButtonColor(
      url.Color,
      this.defaultColor,
      url.IsOutline ?? this.defaultButtonIsOutline
    );
    baseClass += this.getList(
      this.btnSizeList,
      url.Size,
      this.defaultButtonSize
    );
    baseClass += this.getList(this.marginList, url.Margin, this.defaultMargin);
    baseClass += this.getList(
      this.paddingList,
      url.Padding,
      this.defaultPadding
    );
    baseClass += this.getList(
      this.colSpanList,
      url.ColSpan,
      this.defaultColSpan
    );

    return baseClass;
  }

  getButtonColor(colorValue, defaultValue = 0, isOutline = false) {
    let result = isOutline ? this.btnOutlinePrefix : this.btnPrefix;
    result += this.getList(this.colorList, colorValue, defaultValue);
    return result;
  }

  getList(list, urlValue, defaultValue) {
    return list[(urlValue ?? defaultValue) % list.length];
  }

  getButtonNameFromUrl(url) {
    if (url.Name?.length > 0) { return url.Name; }
    if (url.Add?.length > 0) { return url.Add.substring(url.Add.lastIndexOf("/") + 1); }
    return "[[Undifined]]";
  }

  makeButtonName(url) {
    let result = this.getButtonNameFromUrl(url);
    if (url.IsSmallText) {
      result = `<small>${result}</small>`;
    }
    return result;
  }

  makeAnchorButton(url) {
    let a = document.createElement("a");
    a.setAttribute("href", url.Add);
    a.setAttribute("class", this.getButtonClass("btn ", url));
    a.setAttribute("target", url.Target ?? "_blank");
    a.innerHTML = this.makeButtonName(url);
    return a;
  }

  populateUrls(element, urlGroup) {
    for (const url of urlGroup.Urls) {
      element.appendChild(this.makeAnchorButton(url));
    }
  }

  makeTabbedElement(urlGroup) {
    console.log(urlGroup);
  }

  getHeadingWeight(weight, defaultWeight = this.defaultHeadingWeight) {
    return this.getList(this.headingWeightList, weight, defaultWeight);
  }

  makeAccordionHeader(urlGroup) {
    let header = document.createElement(
      this.getHeadingWeight(urlGroup.HeadingWeight)
    );
    let groupId = urlGroup.Name.replace(" ", "_");
    header.setAttribute("class", "accordion-header");
    header.setAttribute("id", groupId + "AccordionHeader");

    let button = document.createElement("button");
    button.setAttribute("class", "accordion-button p-1");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#" + groupId + "Collapse");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", groupId + "Collapse");
    button.textContent = urlGroup.DisplayName;

    header.appendChild(button);

    return header;
  }

  /*
      <h2 class="accordion-header" id="toolLinkAccordionHeader">
        <button class="accordion-button p-1" type="button" data-bs-toggle="collapse"
            data-bs-target="#toolCollapse" aria-expanded="true" aria-controls="toolCollapse">
            Tools
        </button>
    </h2>
  */

  makeAccordionBody(groupName, urlGroup, isDefaultOpen = false) {
    let accordionContainer = document.createElement("accordion-container");
    let groupId = urlGroup.Name.replace(" ", "_");
    let groupClass =
      "accordion-collapse collapse" + (isDefaultOpen ? " show" : "");

    accordionContainer.setAttribute("id", groupId + "Collapse");
    accordionContainer.setAttribute("class", groupClass);
    accordionContainer.setAttribute(
      "aria-labelledby",
      groupId + "AccordionHeader"
    );
    accordionContainer.setAttribute(
      "data-bs-parent",
      "#" + groupName + "Accordion"
    );

    let accordionBody = document.createElement("accordion-body");
    accordionBody.setAttribute("class", "accordion-body");

    let accordionBodyRow = document.createElement("accordion-bodyrow");
    accordionBodyRow.setAttribute("class", "row mt-1");

    urlGroup.Urls.forEach((url) => {
      accordionBodyRow.appendChild(this.makeAnchorButton(url));
    });

    accordionBody.appendChild(accordionBodyRow);
    accordionContainer.appendChild(accordionBody);

    return accordionContainer;
  }

  /*
<div id="toolCollapse" class="accordion-collapse collapse" aria-labelledby="toolLinkAccordionHeader"
  data-bs-parent="#linkAccordion">
  <div class="accordion-body">
      <div class="row mt-1">
          <a class="btn btn-primary btn-sm col mr-1" target="_blank" rel="noreferrer noopener"
              href="https://wex.splunkcloud.com/en-US/app/search/dbi_samurai_cobra_dashboard">
              Splunk <small>(VPN)</small>
          </a>
          <a class="btn btn-primary btn-sm col mr-1" title="WEX Confluence" target="_blank"
              rel="noreferrer noopener"
              href="https://wexinc.atlassian.net/wiki/spaces/WH/pages/153498648613/Feature+Flags">
              Launch Darkly
          </a>
          <a class="btn btn-primary btn-sm col mr-1" target="_blank" rel="noreferrer noopener"
              href="https://dbup.readthedocs.io/en/latest/">
              DBUp
          </a>
          <a class="btn btn-primary btn-sm col mr-1" title="WEX Confluence" target="_blank"
              rel="noreferrer noopener"
              href="https://github.com/wexinc/ps-funding-deposit-processing/tree/main/Wex.Funding.DepositProcessing">
              DBUp Ex. (Funding)
          </a>
      </div>
  </div>
</div>
  */

  makeAccordionItem(urlGroup) {
    let accordion = document.createElement("accordion-base");

    accordion.appendChild(this.makeAccordionHeader(urlGroup));
    accordion.appendChild(this.makeAccordionBody(urlGroup));

    return accordion;
  }

  /*
<div class="accordion-item">
    <h2 class="accordion-header" id="toolLinkAccordionHeader">
        <button class="accordion-button p-1" type="button" data-bs-toggle="collapse"
            data-bs-target="#toolCollapse" aria-expanded="true" aria-controls="toolCollapse">
            Tools
        </button>
    </h2>
    <div id="toolCollapse" class="accordion-collapse collapse" aria-labelledby="toolLinkAccordionHeader"
        data-bs-parent="#linkAccordion">
        <div class="accordion-body">
            <div class="row mt-1">
                <a class="btn btn-primary btn-sm col mr-1" target="_blank" rel="noreferrer noopener"
                    href="https://wex.splunkcloud.com/en-US/app/search/dbi_samurai_cobra_dashboard">
                    Splunk <small>(VPN)</small>
                </a>
                <a class="btn btn-primary btn-sm col mr-1" title="WEX Confluence" target="_blank"
                    rel="noreferrer noopener"
                    href="https://wexinc.atlassian.net/wiki/spaces/WH/pages/153498648613/Feature+Flags">
                    Launch Darkly
                </a>
            </div>
            <div class="row mt-1">
                <a class="btn btn-primary btn-sm col mr-1" target="_blank" rel="noreferrer noopener"
                    href="https://dbup.readthedocs.io/en/latest/">
                    DBUp
                </a>
                <a class="btn btn-primary btn-sm col mr-1" title="WEX Confluence" target="_blank"
                    rel="noreferrer noopener"
                    href="https://github.com/wexinc/ps-funding-deposit-processing/tree/main/Wex.Funding.DepositProcessing">
                    DBUp Ex. (Funding)
                </a>
            </div>
        </div>
    </div>
</div>
  */

  makeAccordionBase(groupName, urlGroups) {
    let accordion = document.createElement("accordion-base");
    accordion.setAttribute("id", groupName + "Accordion");
    accordion.setAttribute("class", "accordion p-0");

    for (const urlGroup of urlGroups) {
      accordion.appendChild(this.makeAccordionItem(urlGroup));
    }

    return accordion;
  }

  /*
<h4 class="white">Dev Links</h4>
<div class="accordion p-0" id="linkAccordion">
  <!-- Insert accordion items here -->
</div>

  */

  makeDisplayElement(urlGroup) {
    let div = document.createElement("button-display");
    div.setAttribute("class", "row p-0 container-fluid");
    div.setAttribute("id", urlGroup.Name);

    let header = document.createElement("h4");
    header.setAttribute("class", "row");
    header.textContent = urlGroup.DisplayName;
    div.appendChild(header);

    let buttonsDiv = document.createElement("button-group");
    buttonsDiv.setAttribute("class", "row");

    for (const url of urlGroup.Urls) {
      buttonsDiv.appendChild(this.makeAnchorButton(url));
    }
    div.appendChild(buttonsDiv);

    return div;
  }

  loadAllData(urlGroups, elementId) {
    let urlContainer = document.getElementById(elementId);

    for (const group of urlGroups) {
      urlContainer.appendChild(this.makeDisplayElement(group));
    }
  }

  loadData(json, elementId, urlGroupName) {
    let urlContainer = document.getElementById(elementId);
    this.populateUrls(
      urlContainer,
      json.Dashboard.UrlGroups.find((ug) => ug.Name == urlGroupName)
    );
  }

  jsonString(input) {
    if (jsonString !== "" && jsonString !== undefined) {
      return JSON.parse(input);
    }
    return null;
  }

  async tryFetchJson(jsonData, url) {
    try {
      let response = await fetch(url);
      let data = await response.json();
      return data;
    } catch (error) {
      console.log("error:" + error);
      return JSON.parse(jsonData);
    }
  }

  btnPrefix = "btn-";
  btnOutlinePrefix = "btn-outline-";

  colorList = [
    "primary ",
    "secondary ",
    "success ",
    "danger ",
    "warning ",
    "info ",
    "light ",
    "dark ",
    "link ",
  ];

  btnSizeList = ["btn-sm ", "", "btn-lg "];
  btnColorList = [
    "btn-primary ",
    "btn-secondary ",
    "btn-success ",
    "btn-danger ",
    "btn-warning ",
    "btn-info ",
    "btn-light ",
    "btn-dark ",
    "btn-link ",
  ];
  btnOutlineList = [
    "btn-outline-primary ",
    "btn-outline-secondary ",
    "btn-outline-success ",
    "btn-outline-danger ",
    "btn-outline-warning ",
    "btn-outline-info ",
    "btn-outline-light ",
    "btn-outline-dark ",
    "btn-outline-link ",
  ];
  marginList = ["mr-0 mt-0 ", "mr-1 mt-1 ", "mr-2 mt-2 ", "mr-3 mt-3 "];
  paddingList = ["p-0 ", "p-1 ", "p-2 ", "p-3 "];
  colSpanList = [
    "col-auto ",
    "col ",
    "col-2 ",
    "col-3 ",
    "col-4 ",
    "col-5 ",
    "col-6 ",
    "col-7 ",
    "col-8 ",
    "col-9 ",
    "col-10 ",
    "col-11 ",
    "col-12 ",
  ];

  headingWeightList = ["normal-text", "h1 ", "h2 ", "h3 ", "h4 ", "h5 ", "h6 "];
}
