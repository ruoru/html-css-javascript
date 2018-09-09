const historys = ['宋', '元', '清', '明', '未详', '金', '隋', '高丽', '周', '南唐', '唐', '后蜀', '五代', '陈', '吴越', '汉前', '西晋', '东汉', '三国魏', '东晋', '宋(刘)', '吴', '闽国', '西汉', '北魏', '北周', '南齌', '南梁', '后梁', '北齐', '中华民国', '新罗', '楚(马)', '吴(杨)', '辽', '新', '后汉', '南北朝', '北汉', '中华人民共和国', '前燕', '西魏', '东魏', '三国吴', '秦', '南汉', '前蜀', '后唐', '秦汉', '三国', '后凉', '西秦', '前秦', '西辽', '西凉', '后赵', '后燕', '南燕', '后秦', '郑（王世充）', '三国蜀', '后晋', '后周', '前凉', '南平', '伪齐', '北燕', '赢秦', '北凉', '西夏', '西燕'];

const alias = ['规范名', '字', '小字', '室名、別號', '别名、曾用名', '諡號', '未詳', '行第', '廟號', '賜號', '封爵', '廟額', '小名', '俗姓', '其他譯名', '俗名', '尊號', '法號', '本姓'];

const addressTypes = ['籍貫(基本地址)', '前住地', '祖籍', '遷住地', '葬地', '另一籍貫(基本地址)', '未詳', '落籍(實際居住地)', '本貫', '死所', '最後所知地', '遊歷或曾經到過', '卜居', '避兵之地', '出生地', '八旗清代', '戶籍地', '本族支裔遷徙路線', '僑居', '坐徙', '流放之地'];

const socialIdentitys = ['从事职业', '学术身份', '军事类身份', '宗室身份', '艺术类身份', '宗教身份', '生平事件', '平民身份'];

async function searchResults() {
  const objSearch1 = getURLSearch();
  const objSearch2 = {
    dynastyCount: sessionStorage.getItem("dynastyCount"),
    nativePlaceCount: sessionStorage.getItem("nativePlaceCount"),
    rushiTypeCount: sessionStorage.getItem("rushiTypeCount"),
    specialityCount: sessionStorage.getItem("specialityCount")
  };
  const pageNum = sessionStorage.getItem("pageNum") || 1;
  const pageSize = sessionStorage.getItem("pageSize");

  const objSearch = Object.assign({}, objSearch1, objSearch2);
  for(let key in objSearch) {
    if(!objSearch[key]) {
      delete objSearch[key];
    }
  }

  const whereFilter = Object.assign({}, objSearch, {
    pageNum,
    pageSize
  });

  try {
    const resp = await gateway.formRequest(
      "GET",
      `/cbdb/person/list`,
      {
        where: whereFilter
      },
      true
    );
    renderResults(resp.data.data);
    renderPagination(resp.count, pageNum, pageSize);
    renderFenmian(resp.data);
    sessionStorage.setItem("total", resp.count);
  } catch (error) {
    console.error(error);
  }
}

function renderResults(results) {
  let resultsHTML = "";
  results.forEach((obj, i) => {
    let item = obj.Person;
    resultsHTML += `<tr>
      <td>${i + 1}</td>
      <td>${item.ChsName}</td>
      <td>${item.Gender}</td>
      <td>${item.ChsDynasty}</td>
      <td>${item.BirthDay > 0 ? item.BirthDay : ""}</td>
      <td>${item.ChtNativePlace || ""}</td>
      <td>${item.ChtChoronymName}</td>
      <td><a href=/person-detail.html?id=${item.Uri}>详情</a></td>
    </tr>`;
  });

  $(`#results`).html(resultsHTML);
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

  bindPageChange();
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

function bindPageChange() {
  $(`#pagination`).unbind();
  $(`#pagination`).click(e => {
    e.preventDefault();
    const pageNumsText = parseInt(e.target.text);
    if (pageNumsText) {
      sessionStorage.setItem("pageNum", pageNumsText);
      searchResults();
    }
  });
}

function onPageChange(pageNumber) {
  const pageSize = sessionStorage.getItem("pageSize"),
    pageNum = sessionStorage.getItem("pageNum"),
    total = sessionStorage.getItem("total");

  if (pageNumber == "prev") {
    let newPageNum = pageNum - 10 > 0 ? pageNum - 10 : 1;
    sessionStorage.setItem("pageNum", newPageNum);
    searchResults();
  } else if (pageNumber == "next") {
    const pageMax = Math.ceil(total / pageSize);
    let newPageNum =
      parseInt(pageNum) + 10 < pageMax ? parseInt(pageNum) + 10 : pageMax;
    sessionStorage.setItem("pageNum", newPageNum);
    searchResults();
  } else if (parseInt(pageNumber)) {
    pageNumber = parseInt(pageNumber);
    const pageMax = Math.ceil(total / pageSize);
    const newPageNum = (pageNumber < 0 && 1) || (pageNumber > pageMax && pageMax) || pageNumber;
    $("#input_jumppageNumber").val(newPageNum);
    sessionStorage.setItem("pageNum", newPageNum);
    searchResults();
  }
}

function init() {
  const objSearch = parseURLSearch();
  for (let key in objSearch) {
    const item = objSearch[key];
  }
  searchResults();
}


$(document).ready(() => {
  resetSession();
  window.onunload = () => {
    resetSession();
  };

  [alias, historys, addressTypes, socialIdentitys].forEach((item, i) => {
    $(`#inputGroupSelect0${i}`).html(() => {
      let stringHTML = `<option value=""></option>`;
      item.forEach(
        subItem =>
          (stringHTML += `<option value=${subItem}>${subItem}</option>`)
      );
      return stringHTML;
    });
  });

  $(`#btn-search`).click(e => {
    sessionStorage.setItem("pageNum", 1);
    searchResults();
  });

  $(`#btn-reset`).click(onClearnAllSearch);

  $("#input_jumppageNumber").bind("keyup", function(event) {
    if (event.keyCode == "13") {
      onPageChange(event.target.value);
    }
  });

  $(`.persons .search1-wrap input[type=text]`).bind("keyup", function(event) {
    const value = event.target.value;
    if(value || value == 0) {
      if(window.delaySearch) {
        clearTimeout(window.delaySearch)
      }
      window.delaySearch = setTimeout(searchResults, 500);
    }
  });

  $(`.persons .search1-wrap select`).bind("change", function(event) {
    searchResults();
  });

  init();
});
