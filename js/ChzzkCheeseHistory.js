let channels = [];
let channel = null;
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let calendarDate = `${year}-${month}`;

const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const yearArr = [2023, 2024, 2025];
const selectboxState = {};

document.addEventListener("DOMContentLoaded", function() {
    chgSearchYear(year);
    chgCalendarYear(year);
    chgCalendarMonth(month);
    
    document.querySelectorAll(".selectbox_component").forEach((element) => {
        const key = element.dataset.key;
        selectboxState[key] = false;
        element.addEventListener("focus", handleFocusChange);
        element.addEventListener("blur", handleFocusChange);
    });
    
    document.getElementById("size").addEventListener("focus", handleFocusChangeSize);
    document.getElementById("size").addEventListener("blur", handleFocusChangeSize);

    let year_selectbox_items = ``;
    for(let i = 0; i < 2; i++) {
        year_selectbox_items = ``;
        for(let year of yearArr) {
            year_selectbox_items += `<li class="selectbox_item">
                <button type="button" class="selectbox_option" onclick="${i == 0 ? "chgSearchYear" : "chgCalendarYear"}(${year});">${year}년</button>
            </li>`;
        }
        document.querySelector(i == 0 ? ".search_year_selectbox" : ".calendar_year_selectbox").innerHTML = year_selectbox_items;
    }

    let month_selectbox_items = ``;
    for(let month of monthArr) {
        month_selectbox_items += `<li class="selectbox_item">
            <button type="button" class="selectbox_option" onclick="chgCalendarMonth(${month});">${month}월</button>
        </li>`;
    }
    document.querySelector(".calendar_month_selectbox").innerHTML = month_selectbox_items;
});

function handleFocusChange(event) {
    const element = event.target;
    const key = element.dataset.key;

    if(!key) return;

    if(event.type === "focus") {
        element.classList.add("selectbox_is_focused");
        document.querySelector(`.${key}_selectbox`).dataset.visible = "block";
    } else if(event.type === "blur") {
        element.classList.remove("selectbox_is_focused");
        setTimeout(function() {
            document.querySelector(`.${key}_selectbox`).dataset.visible = "none";
        }, 100);
    }
}

function handleFocusChangeSize(event) {
    if (event.type === "focus") {
        document.getElementById("size").closest(".search_wrapper").classList.add("search_is_focused");
    } else if (event.type === "blur") {
        document.getElementById("size").closest(".search_wrapper").classList.remove("search_is_focused");
    }
}

function openHistory() {
    if(document.getElementById("size").value == null || document.getElementById("size").value == '') {
        document.getElementById("size").value = 10000;
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
    }

    document.getElementById("apiLink").click();
}

function chgSearchYear(yearParam) {
    document.getElementById("searchYear").value = yearParam;
    document.getElementsByClassName("selectbox_inner")[0].innerHTML = `${yearParam}년` + returnSelectboxIconArrow();

    chgUrl();
}

function chgUrl() {
    document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
}

function chgCalendarYear(yearParam) {
    document.getElementsByClassName("selectbox_inner")[1].innerHTML = `${yearParam}년` + returnSelectboxIconArrow();
    year = yearParam;
}

function chgCalendarMonth(monthParam) {
    document.getElementsByClassName("selectbox_inner")[2].innerHTML = `${monthParam}월` + returnSelectboxIconArrow();
    month = monthParam;
}

function addFile() {
    document.getElementById("jsonFileInput").click();
}

function changeSortType() {
    document.getElementById("channelListContainer").innerHTML = makeList(channels);
}

function chgView(type) {
    if(type === 'Graph') {
        document.getElementById("graphBtn").classList.add("on");
        document.getElementById("calendarBtn").classList.remove("on");
        document.getElementById("channelHistory").dataset.visible = "block";
        document.getElementById("channelHistoryCalendar").dataset.visible = "none";
        document.querySelector(".selectbox").dataset.visible = "none";
    } else if(type === 'Calendar') {
        document.getElementById("graphBtn").classList.remove("on");
        document.getElementById("calendarBtn").classList.add("on");
        document.getElementById("channelHistory").dataset.visible = "none";
        document.getElementById("channelHistoryCalendar").dataset.visible = "block";
        document.querySelector(".selectbox").dataset.visible = "block";
    }
}

function chgCalendarDate(yearParam, monthParam, focusDay) {
    year = yearParam;
    month = monthParam;
    
    document.getElementsByClassName("selectbox_inner")[1].innerHTML = `${year}년` + returnSelectboxIconArrow();
    document.getElementsByClassName("selectbox_inner")[2].innerHTML = `${month}월` + returnSelectboxIconArrow();
    rendarCalendar(focusDay);
}

function goPrev() {
    month--;
    if(month <= 0) month = 12, year -= 1;

    chgCalendarDate(year, month, null);
}

function goNext() {
    month++;
    if(month > 12) month = 1, year++;

    chgCalendarDate(year, month, null);
}

function goDate(date) {
    let splitedDate = date.split('-');

    chgCalendarDate(Number(splitedDate[0]), Number(splitedDate[1]), Number(splitedDate[2]));
}

function goToday() {
    let today = new Date();
    year = today.getFullYear();
    month = today.getMonth() + 1;

    chgCalendarDate(year, month, null);
}

function openDirectInput() {
    document.body.style.cssText = "overflow: hidden; position: fixed; top: 0; width: 100%; height: 100%;";
    document.querySelector(".direct_input").dataset.visible = "flex";
    document.getElementById("directInputString").focus();
}

function closeDirectInput() {
    document.body.removeAttribute("style");
    document.querySelector(".direct_input").dataset.visible = "none";
}

function registDirectInput() {
    channels = [];
    document.getElementById("fileList").innerText = ``;
    document.getElementById("channelHistoryWrap").dataset.visible = "none";

    let cheeseDataArr = null;
    let directInputString = document.getElementById("directInputString").value;

    try {
        const data = JSON.parse(directInputString);
        if(data.code == 200) cheeseDataArr = data.content.data;
        else alert(data.message);
    } catch (error) {
        alert('변환 오류 발생');
        return;
    }

    convertCheeseDataArrToChannelData(cheeseDataArr);

    initializationHtml();
    makeFileDataList();
    
    document.getElementById("directInputString").value = '';
    closeDirectInput();
}

async function readFile(event) {
    const files = event.target.files;
    const cheeseDataArr = await processFiles(files);
    
    channels = [];
    document.getElementById("fileList").innerText = `등록된 파일: ${files.length}건`;
    document.getElementById("channelHistoryWrap").dataset.visible = "none";
    
    convertCheeseDataArrToChannelData(cheeseDataArr);

    initializationHtml();
    makeFileDataList();
}

async function processFiles(files) {
    const fileReadPromises = Array.from(files).map(file => new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if(data.code == 200) resolve(data.content.data);
                else reject(data.message);
            } catch (error) {
                reject(`파일 변환 오류: ${error.message}`);
            }
        };

        reader.onerror = () => reject("파일 읽기 실패");
        reader.readAsText(file);
    }));

    try {
        return (await Promise.all(fileReadPromises)).flat();
    } catch (error) {
        console.error("오류 발생:", error);
        return [];
    }
}

function convertCheeseDataArrToChannelData(cheeseDataArr) {
    if(cheeseDataArr) {
        cheeseDataArr.sort((a, b) => {
            if(a.purchaseDate < b.purchaseDate) return -1;
            if(a.purchaseDate > b.purchaseDate) return 1;
            return 0;
        });

        for(let cheeseData of cheeseDataArr) {
            if(cheeseData.donationType === "TTS") continue;

            let splitedPurchaseDate = cheeseData.purchaseDate.split(' ')[0].split('-');
            let purchaseYear = Number(splitedPurchaseDate[0]);
            let purchaseMonth = Number(splitedPurchaseDate[1]);
            let purchaseDay = Number(splitedPurchaseDate[2]);
            let payAmount = Number(cheeseData.payAmount);

            let channelData = channels.find(channel => channel.channelId === cheeseData.channelId);
            if(!channelData) {
                channelData = createNewChannelData(cheeseData);
                channels.push(channelData);
            }

            let yearData = channelData.yearData.find(data => data.year === purchaseYear);
            if(!yearData) {
                yearData = {
                    year: purchaseYear,
                    yearTotal: 0,
                    yearCount: 0,
                    monthData: []
                }
                channelData.yearData.push(yearData);
            }

            yearData.yearTotal += payAmount;
            yearData.yearCount++;
            
            let monthData = yearData.monthData.find(data => data.month === purchaseMonth);
            if(!monthData) {
                monthData = {
                    month: purchaseMonth,
                    monthTotal: 0,
                    monthCount: 0,
                    dayData: []
                }
                yearData.monthData.push(monthData);
            }

            monthData.monthTotal += payAmount;
            monthData.monthCount++;

            let dayData = monthData.dayData.find(data => data.day === purchaseDay);
            if(!dayData) {
                dayData = {
                    day: purchaseDay,
                    dayTotal: 0,
                    dayCount: 0
                }
                monthData.dayData.push(dayData);
            }

            dayData.dayTotal += payAmount;
            dayData.dayCount++;
        }
    }
}

function initializationHtml() {
    if(window.monthlyChart instanceof Chart) {
        window.monthlyChart.destroy();
    }

    rebuildChannels();

    let totalPayAmount = 0;
    for(let channel of channels) {
        totalPayAmount += channel.channelTotal;
    }

    document.getElementById("channelInfo").innerText = '';
    document.getElementById("channelInfoYear").innerText = '';
    document.getElementById("totalPayAmount").innerText = `전체 후원 금액 : ${totalPayAmount.toLocaleString("ko-KR")}원`;
    document.getElementById("channelListContainer").innerHTML = makeList(channels);
    if(channels.length > 0) {
        document.getElementById("channelListContainer").dataset.visible = "block";
    }
}

function makeFileDataList() {
    let cheeseHistListHtml = '';
    let cnt = 1;

    if(channels.length > 0) {
        for(let channelData of channels) {
            for(let i = 0; i < channelData.yearData.length; i++) {
                cheeseHistListHtml += `
                <tr>
                    <td>${cnt++}</td>
                    <td>${channelData.channelName}</td>
                    <td>${channelData.yearData[i].year}년</td>
                    <td>
                        <div class="check-box">
                            <label for="file_${channelData.channelId}_${channelData.yearData[i].year}">
                                <input type="checkbox" id="file_${channelData.channelId}_${channelData.yearData[i].year}" name="file_cheeseHistList" value="${channelData.channelId}_${channelData.yearData[i].year}" checked />
                                <div class="chkbox">
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" class="chk-svg">
                                        <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                                        <polyline points="4 11 8 15 16 6"></polyline>
                                    </svg>
                                </div>
                            </label>
                        </div>
                    </td>
                </tr>`;
            }
        }
    } else {
        cheeseHistListHtml += `
        <tr>
            <td colspan="3">
                <p>저장된 데이터가 없습니다.</p>
            </td>
        </tr>`;
    }
    
    document.getElementById("cheeseHistList").innerHTML = cheeseHistListHtml;
}

function makeList(channels) {
    let sortType = document.querySelector("input[name='sortType']:checked")?.value;
    let sortedChannels = [...channels];
    if('total' === sortType) {
        sortedChannels.sort((a, b) => b.channelTotal - a.channelTotal);
    }

    let html = `
    <div id="channelList">
        ${sortedChannels.map(channel => `
            <button onclick="getChannelHistory('${channel.channelId}');">
                <span>
                    <img id="cheeseImg" 
                        ${
                            channel.cheese04 ? 'src="./images/cheese04.png"' :
                            channel.cheese03 ? 'src="./images/cheese03.png"' :
                            channel.cheese02 ? 'src="./images/cheese02.png"' :
                            channel.cheese01 ? 'src="./images/cheese01.png"' : ''
                        }
                    >
                    <img id="channelImg" src="${channel.channelImageUrl}" />
                </span>
                <p>${channel.channelName}</p>
                <p>${Number(channel.channelTotal).toLocaleString("ko-KR")}원</p>
            </button>
        `).join('')}
    </div>`;

    return html;
}

function getChannelHistory(channelId) {
    let channelInfoYear = '';
    channel = channels.find(channel => channel.channelId === channelId);
    
    document.getElementById("channelHistoryWrap").dataset.visible = "block";
    document.getElementById("channelInfo").innerText = `${channel.channelName} 총 후원 금액 : ${Number(channel.channelTotal).toLocaleString("ko-KR")}원 (${channel.channelCount}회)`;

    if(channel.yearData.length > 0) {
        let yearIdx = -1;
        for(let year of yearArr) {
            yearIdx = channel.yearData.findIndex(data => data.year === year);
            if(yearIdx !== -1) {
                channelInfoYear += `<li>${channel.yearData[yearIdx].year}년 : ${Number(channel.yearData[yearIdx].yearTotal).toLocaleString("ko-KR")}원 (${channel.yearData[yearIdx].yearCount}회)</li>`;
                yearIdx = -1;
            }
        }
    }
    document.getElementById("channelInfoYear").innerHTML = channelInfoYear;
    
    renderMonthlyChart();
    rendarCalendar();
}

function renderMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');

    if (window.monthlyChart instanceof Chart) {
        window.monthlyChart.destroy();
    }

    window.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            datasets: makeChartDatasets()
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `${tooltipItems[0].dataset.label} ${tooltipItems[0].label}`;
                        },
                        label: function(tooltipItem) {
                            return `후원 금액: ${tooltipItem.formattedValue}원`;
                        },
                        footer: function(tooltipItem) {
                            let year = Number(tooltipItem[0].dataset.label.replace(/[^0-9]/g, ''));
                            let yearData = channel.yearData.find(data => data.year === year);
                            let dataIdx = tooltipItem[0].dataIndex;
                            let monthCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                            if(yearData) {
                                let monthData = null;
                                for(let month of monthArr) {
                                    monthData = yearData.monthData.find(data => data.month === month);
                                    if(monthData) {
                                        monthCount[month - 1] = monthData.monthCount;
                                    }
                                }
                            }

                            return `후원 횟수: ${monthCount[dataIdx]}회`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '후원 금액 (원)'
                    }
                }
            }
        }
    });
}

function makeChartDatasets() {
    let datasets = [];
    let yearIdx = -1;
    let yearData = null;
    let monthIdx = -1;
    let monthTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for(let year of yearArr) {
        yearIdx = channel.yearData.findIndex(data => data.year === year);
        if(yearIdx !== -1) {
            yearData = channel.yearData[yearIdx];

            for(let month of monthArr) {
                monthIdx = yearData.monthData.findIndex(data => data.month === month);
                if(monthIdx !== -1) {
                    monthTotal[month - 1] = yearData.monthData[monthIdx].monthTotal;
                }
            }

            datasets.push({
                label: `${channel.yearData[yearIdx].year}년`,
                data: monthTotal
            });
            
            yearIdx = -1;
            yearData = null;
            monthIdx = -1;
            monthTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }

    return datasets;
}

function rendarCalendar(focusDay) {
    let yearData = null;
    let monthData = null;
    let dayData = null;

    if(channel) {
        yearData = channel.yearData.find(data => data.year === year);
        monthData = yearData ? yearData.monthData.find(data => data.month === month) : null;

        document.getElementsByClassName("calendar_month_total")[0].innerHTML = monthData ? (`<h3>${month}월 후원 금액 : ${Number(monthData.monthTotal).toLocaleString("ko-KR")}원 (${monthData.monthCount}회)</h3>`) : `<h3>${month}월 후원 금액: 0원 (0회)</h3>`;
        document.getElementsByClassName("cheese_history")[0].innerHTML = `
        <ul>
            <li><button onclick="goToday();"><h4>TODAY</h4></button></li>
            ${channel.onedayMaxCheese > 0 ? `<li><button onclick="goDate('${channel.onedayMaxCheeseDate}');"><h4>최고후원금액 : ${Number(channel.onedayMaxCheese).toLocaleString("ko-KR")}원</h4></button></li>` : ''}
            ${channel.cheese01 ? `<li><button onclick="goDate('${channel.cheeseDate01}');"><img src="./images/cheese01.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.cheese02 ? `<li><button onclick="goDate('${channel.cheeseDate02}');"><img src="./images/cheese02.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.cheese03 ? `<li><button onclick="goDate('${channel.cheeseDate03}');"><img src="./images/cheese03.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.cheese04 ? `<li><button onclick="goDate('${channel.cheeseDate04}');"><img src="./images/cheese04.png" class="cheese_history_button"></button></li>` : ''}
        </ul>`;
    }
    
    document.getElementsByClassName("calendarDate")[0].innerText = `${year}년 ${month}월`;

    const prevLast = new Date(year, month - 1, 0);
    const thisLast = new Date(year, month, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if(PLDay !== 6) {
        for(let i = 0; i < PLDay + 1; i++) {
            prevDates.unshift(PLDate - i);
        }
    }

    for(let i = 1; i < 7 - TLDay; i++) {
        nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);

    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    dates.forEach((date, i) => {
        const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other';
        
        if(i % 7 === 0) dates[i] = `<tr><td class="date">`;
        else dates[i] = `<td class="date">`;

        dates[i] += `
        <span class="${condition}">
            <h4>${date} 
                    ${i >= firstDateIndex && i < lastDateIndex + 1 && channel ? `<span class="cheeseDate_span">
                        ${channel.firstCheeseDate === makeDate(year, month, date) ? '<img src="./images/fan_03.png" class="cheeseDate">' : ''}
                        ${channel.cheese01 && channel.cheeseDate01 === makeDate(year, month, date) ? '<img src="./images/cheese01.png" class="cheeseDate">' : ''}
                        ${channel.cheese02 && channel.cheeseDate02 === makeDate(year, month, date) ? '<img src="./images/cheese02.png" class="cheeseDate">' : ''}
                        ${channel.cheese03 && channel.cheeseDate03 === makeDate(year, month, date) ? '<img src="./images/cheese03.png" class="cheeseDate">' : ''}
                        ${channel.cheese04 && channel.cheeseDate04 === makeDate(year, month, date) ? '<img src="./images/cheese04.png" class="cheeseDate">' : ''}
                    </span>` : ''}
                </h4>
        </span>`;

        dates[i] += `<div class="date_inner"><ul>`;
        
        if(monthData) {
            dayData = monthData.dayData.find(data => data.day === date);
            if(i >= firstDateIndex && i < lastDateIndex + 1 && dayData) {
                dates[i] += `
                    <li>${Number(dayData.dayTotal).toLocaleString("ko-KR")}원</li>
                    <li>(${dayData.dayCount}회)</li>
                `;
            }

            dayData = null;
        }

        dates[i] += `</ul></div></td>`;
        
        if(i % 7 === 6) dates[i] += `</tr>`;
    });

    document.querySelector(".dates").innerHTML = dates.join('');
    
    const today = new Date();
    if(month === today.getMonth() + 1 && year === today.getFullYear()) {
        for(let date of document.querySelectorAll('.date .this')) {
            if(Number(date.innerText) === today.getDate()) {
                date.closest(".date").classList.add('today');
                break;
            }
        }
    }

    if(focusDay != null && focusDay > 0) {
        for(let date of document.querySelectorAll('.date .this')) {
            if(Number(date.innerText) === focusDay) {
                date.closest(".date").classList.add('focus_day');
                break;
            }
        }
    }
}

function makeDate(year, month, date) {
    return `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
}

function openManageLocalStorage() {
    document.body.style.cssText = "overflow: hidden; position: fixed; top: 0; width: 100%; height: 100%;";
    document.querySelector(".local_storage").dataset.visible = "flex";
    loadLocalStorageDataList();
}

function closeManageLocalStorage() {
    document.body.removeAttribute("style");
    document.querySelector(".local_storage").dataset.visible = "none";
}

function loadLocalStorageDataList() {
    let tmpChannels = [];
    let channelData = null;
    let channelId = null;
    let channelName = null;
    let channelYear = null;
    let channelYearDataArr = null;
    let cheeseHistListHtml = '';
    let cnt = 1;
    
    let localStorageKeys = Object.keys(localStorage);
    for(let key of localStorageKeys) {
        if(key.indexOf('_subscription') < 0) {
            channelData = getLocalStorageChannelData(key);
            if(!channelData.yearData || channelData.yearData.length === 0) localStorage.removeItem(key);
        }
    }
    localStorageKeys = Object.keys(localStorage);
    
    if(localStorageKeys.length > 0) {
        for(let key of localStorageKeys) {
            if(key.indexOf('_subscription') < 0) {
                tmpChannels.push(getLocalStorageChannelData(key));
            }
        }
        
        if(tmpChannels.length > 0) {
            tmpChannels.sort((a, b) => a.channelName.localeCompare(b.channelName));
            
            for(let channel of tmpChannels) {
                channel.yearData.sort((a, b) => a.year - b.year);
    
                channelId = channel.channelId;
                channelName = channel.channelName;
                channelYearDataArr = channel.yearData;
                
                for(let yearData of channelYearDataArr) {
                    if(!yearData) continue;
                    channelYear = yearData.year;
                    
                    cheeseHistListHtml += `
                    <tr>
                        <td>${cnt++}</td>
                        <td>${channelName}</td>
                        <td>${channelYear}년</td>
                        <td>
                            <div class="check-box">
                                <label for="localStorage_${channelId}_${channelYear}">
                                    <input type="checkbox" id="localStorage_${channelId}_${channelYear}" name="localStorage_cheeseHistList" value="${channelId}_${channelYear}" checked />
                                    <div class="chkbox">
                                        <svg width="20px" height="20px" viewBox="0 0 20 20" class="chk-svg">
                                            <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                                            <polyline points="4 11 8 15 16 6"></polyline>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                        </td>
                    </tr>`;
                }
            }
        } else {
            cheeseHistListHtml += `
            <tr>
                <td colspan="3">
                    <p>저장된 데이터가 없습니다.</p>
                </td>
            </tr>`;
        }
    } else {
        cheeseHistListHtml += `
        <tr>
            <td colspan="3">
                <p>저장된 데이터가 없습니다.</p>
            </td>
        </tr>`;
    }
    
    document.getElementById("cheeseHistLocalStorageList").innerHTML = cheeseHistListHtml;
    document.getElementById("localStorage_allCheck").checked = true;
}

function allCheck(id) {
    let isChecked = document.getElementById(id).checked;

    if("file_allCheck" === id) {
        document.querySelectorAll("input[name='file_cheeseHistList']").forEach((input) => {
            input.checked = isChecked;
        });
    } else if("localStorage_allCheck") {
        document.querySelectorAll("input[name='localStorage_cheeseHistList']").forEach((input) => {
            input.checked = isChecked;
        });
    }
}

function getLocalStorageChannelData(channelId) {
    return JSON.parse(decodeURIComponent(localStorage.getItem(channelId)));
}

function saveLocalStorage() {
    let checkedList = document.querySelectorAll("input[name='file_cheeseHistList']:checked");
    
    if(checkedList.length > 0) {
        let checkedValue = null;
        let channelId = null;
        let yearParam = null;
        let channelData = null;
        let count = 0;
        
        for(let checked of checkedList) {
            checkedValue = checked.value.split("_");
            channelId = checkedValue[0];
            yearParam = checkedValue[1];
    
            channelData = channels.find(channel => channel.channelId === channelId);
            if(channelData) {
                setLocalStorage(channelId, yearParam, channelData);
                count++;
            }
        }
    
        loadLocalStorageDataList();
        alert(`${count}건의 데이터가 저장되었습니다.`);
    } else {
        alert('선택된 데이터가 없습니다.');
    }
}

function setLocalStorage(channelId, yearParam, channelData) {
    let local_channelData = getLocalStorageChannelData(channelId);
    let local_yearDataIndex = null;
    let flag = false;
    yearParam = Number(yearParam);
    
    if(local_channelData) {
        local_yearDataIndex = local_channelData.yearData.findIndex(data => data.year === yearParam);
        if(local_yearDataIndex !== -1) {
            if(channelData) {
                local_channelData.channelImageUrl = channelData.channelImageUrl;
                local_channelData.yearData[local_yearDataIndex] = channelData.yearData.find(data => data.year === yearParam);
                flag = true;
            }
        }
    } else {
        local_channelData = createNewChannelData(channelData);
    }
    
    if(!flag) {
        local_channelData.yearData.push(channelData.yearData.find(data => data.year === yearParam));
    }
    
    localStorage.setItem(channelId, encodeURIComponent(JSON.stringify(local_channelData)));
}

function deleteCheckedLocalStorage() {
    let checkedList = document.querySelectorAll("input[name='localStorage_cheeseHistList']:checked");
    
    if(checkedList.length > 0) {
        let isConfirm = confirm(`${checkedList.length}건의 데이터가 삭제됩니다.\n정말 삭제하시겠습니까?`);
        
        if(isConfirm) {
            let deleteDatas = [];
            let deleteData = null;
            let splitedIdnYear = null;
            let channelId = null;
            let channelYear = null;
            let channelData = null;
            let yearDataIndex = -1;

            for(let checked of checkedList) {
                splitedIdnYear = checked.value.split("_");
                channelId = splitedIdnYear[0];
                channelYear = Number(splitedIdnYear[1]);

                deleteData = deleteDatas.find(channel => channel.channelId === channelId);
                if(!deleteData) {
                    deleteData = {
                        channelId: channelId,
                        year: []
                    }
                    deleteDatas.push(deleteData);
                }
                deleteData.year.push(channelYear);

                splitedIdnYear = null;
                channelId = null;
                channelYear = null;
                deleteData = null;
            }
            
            if(deleteDatas.length > 0) {
                for(let deleteData of deleteDatas) {
                    channelData = getLocalStorageChannelData(deleteData.channelId);

                    for(let year of deleteData.year) {
                        yearDataIndex = channelData.yearData.findIndex(yearData => yearData.year === year);
                        if(yearDataIndex !== -1) {
                            channelData.yearData.splice(yearDataIndex, 1);
                        }
                        yearDataIndex = -1;
                    }

                    localStorage.setItem(channelData.channelId, encodeURIComponent(JSON.stringify(channelData)));
                    channelData = null;
                }
            }
        }
    } else {
        alert('선택된 데이터가 없습니다.');
    }

    loadLocalStorageDataList();
}

function applyLocalStorage() {
    let checkedList = document.querySelectorAll("input[name='localStorage_cheeseHistList']:checked");
    document.getElementById("channelHistoryWrap").dataset.visible = "none";
    
    if(checkedList.length > 0) {
        let checkedDatas = [];
        let checkedData = null;
        let splitedIdnYear = null;
        let checkedChannelId = null;
        let checkedChannelYear = null;

        let localChannelData = null;
        let localYearData = null;

        let channelData = null;
        let yearDataIndex = -1;

        for(let checked of checkedList) {
            splitedIdnYear = checked.value.split("_");
            checkedChannelId = splitedIdnYear[0];
            checkedChannelYear = Number(splitedIdnYear[1]);

            checkedData = checkedDatas.find(channel => channel.channelId === checkedChannelId);

            if(!checkedData) {
                checkedData = {
                    channelId: checkedChannelId,
                    year: []
                }
                checkedDatas.push(checkedData);
            }

            checkedData.year.push(checkedChannelYear);

            splitedIdnYear = null;
            checkedChannelId = null;
            checkedChannelYear = null;
            checkedData = null;
        }

        if(checkedDatas.length > 0) {
            for(let checkedData of checkedDatas) {
                localChannelData = getLocalStorageChannelData(checkedData.channelId);

                for(let year of checkedData.year) {
                    localYearData = localChannelData.yearData.find(yearData => yearData.year === year);
                    channelData = channels.find(channel => channel.channelId === checkedData.channelId);
                    
                    if(channelData) {
                        yearDataIndex = channelData.yearData.findIndex(yearData => yearData.year === year);

                        if(yearDataIndex !== -1) {
                            channelData.yearData.splice(yearDataIndex, 1);
                        }

                        channelData.yearData.push(localYearData);
                        
                        yearDataIndex = -1;
                    } else {
                        channelData = createNewChannelData(localChannelData);
                        channelData.yearData.push(localYearData);
                        channels.push(channelData);
                    }

                    localYearData = null;
                    channelData = null;
                }
                
                localChannelData = null;
            }
        }
        
        initializationHtml();
        closeManageLocalStorage();
    } else {
        alert('선택된 데이터가 없습니다.');
    }
}

function rebuildChannels() {
    if(channels[0] !== '') {
        channels.sort((a, b) => a.channelName.localeCompare(b.channelName));

        for(let channel of channels) {
            channel.channelTotal = 0;
            channel.channelCount = 0;
            channel.cheese01 = false;
            channel.cheeseDate01 = null;
            channel.cheese02 = false;
            channel.cheeseDate02 = null;
            channel.cheese03 = false;
            channel.cheeseDate03 = null;
            channel.cheese04 = false;
            channel.cheeseDate04 = null;
            channel.firstCheeseDate = null;
            channel.onedayMaxCheese = 0;
            channel.onedayMaxCheeseDate = null;

            channel.yearData.sort((a, b) => a.year - b.year);

            for(let year of yearArr) {
                let yearData = channel.yearData.find(data => data.year === year);

                if(yearData) {
                    for(let month of monthArr) {
                        let monthData = yearData.monthData.find(data => data.month === month);
                        
                        if(monthData && monthData.dayData) {
                            for(let dayData of monthData.dayData) {
                                channel.channelTotal += dayData.dayTotal;
                                channel.channelCount += dayData.dayCount;

                                if(!channel.firstCheeseDate) channel.firstCheeseDate = makeDate(year, month, dayData.day);
                                else if(!channel.firstCheeseDate.localeCompare(makeDate(year, month, dayData.day))) channel.firstCheeseDate = makeDate(year, month, dayData.day);
                                
                                if(!channel.cheese01 && channel.channelTotal >= 100_000) {
                                    channel.cheese01 = true;
                                    channel.cheeseDate01 = makeDate(year, month, dayData.day);
                                }
                                
                                if(!channel.cheese02 && channel.channelTotal >= 1_000_000) {
                                    channel.cheese02 = true;
                                    channel.cheeseDate02 = makeDate(year, month, dayData.day);
                                }
                                
                                if(!channel.cheese03 && channel.channelTotal >= 10_000_000) {
                                    channel.cheese03 = true;
                                    channel.cheeseDate03 = makeDate(year, month, dayData.day);
                                }
                                
                                if(!channel.cheese04 && channel.channelTotal >= 100_000_000) {
                                    channel.cheese04 = true;
                                    channel.cheeseDate04 = makeDate(year, month, dayData.day);
                                }

                                if(channel.onedayMaxCheese < dayData.dayTotal) {
                                    channel.onedayMaxCheese = dayData.dayTotal;
                                    channel.onedayMaxCheeseDate = makeDate(year, month, dayData.day);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function createNewChannelData(channelData) {
    return {
        channelId: channelData.channelId,
        channelName: channelData.channelName,
        channelImageUrl: channelData.channelImageUrl,
        channelTotal: 0,
        channelCount: 0,
        cheese01: false,
        cheeseDate01: null,
        cheese02: false,
        cheeseDate02: null,
        cheese03: false,
        cheeseDate03: null,
        cheese04: false,
        cheeseDate04: null,
        firstCheeseDate: null,
        onedayMaxCheese: 0,
        onedayMaxCheeseDate: null,
        yearData: []
    }
}

function returnSelectboxIconArrow() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
        <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
    </svg>`;
}