async function getDetail(id) {
  try {
    const resp = await gateway.formRequest(
      "GET",
      `/cbdb/person/info`,
      {
        where: {
          person_uri: id
        }
      },
      true
    );
    const data = resp.data.Person;
    const tabs = [
      [],
      data.Entry,
      data.Posting,
      data.Address,
      data.Kinship,
      [],
      [],
      [],
      []
    ];
    console.log(data);
    renderInfo(data);
    renderTabs(tabs);
  } catch (error) {
    console.error(error);
  }
}

function renderInfo(data) {
  let privateInfoHTML = `
    <h3>${data.ChsName}</h3>
    <div>
      <a href=${"#"}>RDF</a>
      <a href=${"#"}>JSON</a>
      <a href=${"#"}>XML</a>
    </div>
  `;

  $(`#person_name`).html(privateInfoHTML);

  let infoHTML = `<tr>
      <td>别名</td>
      <td>${data.ChsCourtesyName}</td>
    </tr>
    <tr>
      <td>生辰年</td>
      <td>${data.ChsName}</td>
    </tr>
    <tr>
      <td>死亡年</td>
      <td>${data.ChsName}</td>
    </tr>
    <tr>
      <td>所属朝代</td>
      <td>${data.ChsName}</td>
    </tr>
    <tr>
      <td>郡望</td>
      <td>${data.ChsNativePlace}</td>
    </tr>
    <tr>
      <td>双亲状态</td>
      <td>${data.ChsName}</td>
    </tr>
    <tr>
      <td>种族部落</td>
      <td>${data.ChsName}</td>
    </tr>
    <tr>
      <td>少数民族</td>
      <td>${data.ChsName}</td>
    </tr>`;

  $(`#tb0`).html(infoHTML);
}

function renderTabs(tabs) {
  tabs.forEach((item, index) => {
    let resultsHTML = "";
    const i = index + 1;
    if (i == 1) {
      item.forEach((subItem, subIndex) => {
        resultsHTML += `<tr>
          <td>${subIndex + 1}</td>
          <td>${subItem.ChsName}</td>
          <td>${subItem.Gender}</td>
          <td>${subItem.ChsDynasty}</td>
          <td>${"这里是啥"}</td>
        </tr>`;
      });
    } else if (i == 2) {
      item.forEach((subItem, subIndex) => {
        resultsHTML += `<tr>
          <td>${subIndex + 1}</td>
          <td>${subItem.RushiType}</td>
          <td>${subItem.LastYear}</td>
          <td>${subItem.RushiYear}</td>
          <td>${subItem.ChtAddrName}</td>
          <td>${subItem.ChtAddrName}</td>
        </tr>`;
      });
    } else if (i == 3) {
      item.forEach((subItem, subIndex) => {
        resultsHTML += `<tr>
          <td>${subIndex + 1}</td>
          <td>${subItem.ChuShouType}</td>
          <td>${subItem.OfficeName}</td>
          <td>${subItem.FirstYear}</td>
          <td>${subItem.LastYear}</td>
          <td>${subItem.Source}</td>
        </tr>`;
      });
    } else if (i == 4) {
      item.forEach((subItem, subIndex) => {
        resultsHTML += `<tr>
          <td>${subIndex + 1}</td>
          <td>${subItem.FirstYear}</td>
          <td>${subItem.LastYear}</td>
          <td>${subItem.AddrType}</td>
          <td>${subItem.ChtAddrName}</td>
        </tr>`;
      });
    } else if (i == 5) {
      item.forEach((subItem, subIndex) => {
        resultsHTML += `<tr>
          <td>${subIndex + 1}</td>
          <td>${subItem.KinRelName}</td>
          <td>${subItem.KinRelName}</td>
          <td>${subItem.KinPersonName}</td>
          <td>${"这里是啥"}</td>
        </tr>`;
      });
    } else if (i == 6) {
    } else if (i == 7) {
    } else if (i == 8) {
    } else if (i == 9) {
    }
    $(`#tb${i}`).html(resultsHTML);
  });
}

function renderPagination(total, pageNum, pageSize) {
  const pageMax = Math.ceil(total / pageSize);

  let paginationHTMLContent = "";
  if (pageMax > 9) {
    if (pageMax - pageNum < 5) {
      [
        pageMax - 8,
        pageMax - 7,
        pageMax - 6,
        pageMax - 5,
        pageMax - 4,
        pageMax - 3,
        pageMax - 2,
        pageMax - 1,
        pageMax
      ].map(item => {
        paginationHTMLContent += `<li class="page-item"><a class="page-link ${item ==
          pageNum && "select"}" href="#">${item}</a></li>`;
      });
    } else if (pageNum < 5) {
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => {
        paginationHTMLContent += `<li class="page-item"><a class="page-link ${item ==
          pageNum && "select"}" href="#">${item}</a></li>`;
      });
    } else {
      [
        pageNum - 4,
        pageNum - 3,
        pageNum - 2,
        pageNum - 1,
        pageNum,
        parseInt(pageNum) + 1,
        parseInt(pageNum) + 2,
        parseInt(pageNum) + 3,
        parseInt(pageNum) + 4
      ].map(item => {
        paginationHTMLContent += `<li class="page-item"><a class="page-link ${item ==
          pageNum && "select"}" href="#">${item}</a></li>`;
      });
    }
  } else {
    for (let item = 1; item <= pageMax; item++) {
      paginationHTMLContent += `<li class="page-item"><a class="page-link ${item ==
        pageNum && "select"}" href="#">${item}</a></li>`;
    }
  }

  const paginationHTML = `<li class="page-item">
      <a class="page-link" href="#" onClick=onPageChange('prev')>
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    ${paginationHTMLContent}
    <li class="page-item">
      <a class="page-link" href="#" onClick=onPageChange('next')>
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;

  $(`#pagination`).html(paginationHTML);

  onPageChange();
}

function renderFenmian(objFenmian) {
  if (objFenmian.data) delete objFenmian.data;
  for (let key in objFenmian) {
    let subFenmianHTML = "";
    const fenmianValues = objFenmian[key];
    const sessionStorageValue = sessionStorage.getItem(key);
    for (let itemKey in fenmianValues) {
      const itemValue = fenmianValues[itemKey];

      subFenmianHTML += `<a class=${sessionStorageValue == itemKey &&
        "select"} onclick="onFenmianSearch('${key}', '${itemKey}')">${itemKey}(${itemValue})</a>`;
    }
    $(`#fenmian-${key}`).html(subFenmianHTML);
  }
}

function getURLSearch() {
  const objFilter = {
    aliasType: $(`#inputGroupSelect00`).val(),
    dynasty: $(`#inputGroupSelect01`).val(),
    addressType: $(`#inputGroupSelect02`).val(),
    officials: $(`#inputGroupSelect03`).val(),
    userName: $(`#s1-name`).val(),
    aliasName: $(`#s1-othername`).val(),
    address: $(`#s1-address`).val()
  };

  for (let key in objFilter) {
    const value = objFilter[key];
    if (!value) delete objFilter[key];
  }

  return objFilter;
}

function parseURLSearch() {
  let search = decodeURIComponent(window.location.search),
    objSearch = {};
  if (search) {
    search
      .substr(1)
      .split("&")
      .forEach(item => {
        const sitem = item.split("=");
        objSearch[sitem[0]] = sitem[1];
      });
  }
  return objSearch;
}

function resetSession() {
  sessionStorage.clear();
  sessionStorage.setItem("pageNum", 1);
  sessionStorage.setItem("pageSize", 20);
}

function onFenmianSearch(key, value) {
  let fenmianValue = sessionStorage.getItem(key);
  if (fenmianValue == value) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, value);
  }
  searchResults();
}

function onClearnAllSearch() {
  $(`#inputGroupSelect00`).val("");
  $(`#inputGroupSelect01`).val("");
  $(`#inputGroupSelect02`).val("");
  $(`#inputGroupSelect03`).val("");
  $(`#s1-name`).val("");
  $(`#s1-othername`).val("");
  $(`#s1-address`).val("");
  resetSession();
  searchResults();
}

function onPageChange(pageNumber) {
  $(`#pagination`).unbind();
  $(`#pagination`).click(e => {
    e.preventDefault();
    const pageSize = sessionStorage.getItem("pageSize"),
      pageNum = sessionStorage.getItem("pageNum"),
      total = sessionStorage.getItem("total");

    const pageNumsText = parseInt(e.target.text);
    if (pageNumsText) {
      sessionStorage.setItem("pageNum", pageNumsText);
      searchResults();
    } else if (pageNumber == "prev") {
      let newPageNum = pageNum - 10 > 0 ? pageNum - 10 : 1;
      sessionStorage.setItem("pageNum", newPageNum);
      searchResults();
    } else if (pageNumber == "next") {
      const pageMax = Math.ceil(total / pageSize);
      let newPageNum =
        parseInt(pageNum) + 10 < pageMax ? parseInt(pageNum) + 10 : pageMax;
      sessionStorage.setItem("pageNum", newPageNum);
      searchResults();
    }
  });
}

function init() {
  const objSearch = parseURLSearch();
  getDetail(objSearch.id);
}

$(document).ready(() => {
  init();
});
