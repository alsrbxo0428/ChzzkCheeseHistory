let channels = [];
let channel = null;
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let calendarDate = `${year}-${month}`;

const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const yearArr = [2024, 2025];
const selectboxState = {};

document.addEventListener("DOMContentLoaded", function() {
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
    for(let year of yearArr) {
        year_selectbox_items += `<li class="selectbox_item">
            <button type="button" class="selectbox_option" onclick="chgCalendarYear(${year});">${year}년</button>
        </li>`;
    }
    document.querySelector(".calendar_year_selectbox").innerHTML = year_selectbox_items;

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
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/gift/subscription/send-history?page=0&size=${document.getElementById("size").value}`;
    }
    
    document.getElementById("apiLink").click();
}

function chgUrl() {
    document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/gift/subscription/send-history?page=0&size=${document.getElementById("size").value}`;
}

function chgCalendarYear(yearParam) {
    document.getElementsByClassName("selectbox_inner")[0].innerHTML = `${yearParam}년` + returnSelectboxIconArrow();
    year = yearParam;
}

function chgCalendarMonth(monthParam) {
    document.getElementsByClassName("selectbox_inner")[1].innerHTML = `${monthParam}월` + returnSelectboxIconArrow();
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
    
    document.getElementsByClassName("selectbox_inner")[0].innerHTML = `${year}년` + returnSelectboxIconArrow();
    document.getElementsByClassName("selectbox_inner")[1].innerHTML = `${month}월` + returnSelectboxIconArrow();
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

async function readFile(event) {
    const files = event.target.files;
    const subscriptionDataArr = await processFiles(files);
    
    channels = [];
    document.getElementById("fileList").innerText = `등록된 파일: ${files.length}건`;
    document.getElementById("channelHistoryWrap").dataset.visible = "none";

    if(subscriptionDataArr) {
        subscriptionDataArr.sort((a, b) => {
            if(a.historyDate < b.historyDate) return -1;
            if(a.historyDate > b.historyDate) return 1;
            return 0;
        });

        for(let subscriptionData of subscriptionDataArr) {
            let splitedHistoryDate = subscriptionData.historyDate.split(' ')[0].split('-');
            let historyYear = Number(splitedHistoryDate[0]);
            let historyMonth = Number(splitedHistoryDate[1]);
            let historyDay = Number(splitedHistoryDate[2]);

            let historyStatus = subscriptionData.historyStatus;
            let tier = subscriptionData.tier;
            let quantity = subscriptionData.historyQuantity;

            let channelData = channels.find(channel => channel.channelId === subscriptionData.channelId);
            if(!channelData) {
                channelData = createNewChannelData(subscriptionData);
                channels.push(channelData);
            }

            let yearData = channelData.yearData.find(data => data.year === historyYear);
            if(!yearData) {
                yearData = {
                    year: historyYear,
                    yearTotal: 0,
                    yearCount1: 0,
                    yearCount2: 0,
                    yearCancel1: 0,
                    yearCancel2: 0,
                    monthData: []
                }
                channelData.yearData.push(yearData);
            }
            
            let monthData = yearData.monthData.find(data => data.month === historyMonth);
            if(!monthData) {
                monthData = {
                    month: historyMonth,
                    monthTotal: 0,
                    monthCount1: 0,
                    monthCount2: 0,
                    monthCancel1: 0,
                    monthCancel2: 0,
                    dayData: []
                }
                yearData.monthData.push(monthData);
            }

            let dayData = monthData.dayData.find(data => data.day === historyDay);
            if(!dayData) {
                dayData = {
                    day: historyDay,
                    dayTotal: 0,
                    dayCount1: 0,
                    dayCount2: 0,
                    dayCancel1: 0,
                    dayCancel2: 0,
                }
                monthData.dayData.push(dayData);
            }

            if("COMPLETED" === historyStatus) {
                yearData.yearTotal += quantity;
                monthData.monthTotal += quantity;
                dayData.dayTotal += quantity;

                if("TIER_1" === tier) {
                    yearData.yearCount1 += quantity;
                    monthData.monthCount1 += quantity;
                    dayData.dayCount1 += quantity;
                } else if("TIER_2" === tier) {
                    yearData.yearCount2 += quantity;
                    monthData.monthCount2 += quantity;
                    dayData.dayCount2 += quantity;
                }
            } else if("PARTIAL_REFUND" === historyStatus) {
                yearData.yearTotal -= quantity;
                monthData.monthTotal -= quantity;
                dayData.dayTotal -= quantity;

                if("TIER_1" === tier) {
                    yearData.yearCount1 -= quantity;
                    monthData.monthCount1 -= quantity;
                    dayData.dayCount1 -= quantity;

                    yearData.yearCancel1 += quantity;
                    monthData.monthCancel1 += quantity;
                    dayData.dayCancel1 += quantity;
                } else if("TIER_2" === tier) {
                    yearData.yearCount2 -= quantity;
                    monthData.monthCount2 -= quantity;
                    dayData.dayCount2 -= quantity;

                    yearData.yearCancel2 += quantity;
                    monthData.monthCancel2 += quantity;
                    dayData.dayCancel2 += quantity;
                }
            }
        }
    }

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
                else reject(`${data.message}`);
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

function initializationHtml() {
    if(window.monthlyChart instanceof Chart) {
        window.monthlyChart.destroy();
    }

    rebuildChannels();

    let total = 0;
    let count1 = 0;
    let count2 = 0;
    for(let channel of channels) {
        total += channel.channelTotal;
        count1 += channel.channelCount1;
        count2 += channel.channelCount2;
    }

    document.getElementById("channelInfo").innerText = '';
    document.getElementById("channelInfoYear").innerText = '';
    document.getElementById("channelHistoryWrap").dataset.visible = "none";
    document.getElementById("totalPayAmount").innerText = `구독선물 횟수 : ${total}회(All) / ${count1}회(1T) / ${count2}회(2T)`;
    document.getElementById("channelListContainer").innerHTML = makeList(channels);
    if(channels.length > 0) {
        document.getElementById("channelListContainer").dataset.visible = "block";
    }
}

function makeFileDataList() {
    let subscriptionHistListHtml = '';
    let cnt = 1;

    if(channels.length > 0) {
        for(let channelData of channels) {
            for(let i = 0; i < channelData.yearData.length; i++) {
                subscriptionHistListHtml += `
                <tr>
                    <td>${cnt++}</td>
                    <td>${channelData.channelName}</td>
                    <td>${channelData.yearData[i].year}년</td>
                    <td>
                        <div class="check-box">
                            <label for="file_${channelData.channelId}_${channelData.yearData[i].year}">
                                <input type="checkbox" id="file_${channelData.channelId}_${channelData.yearData[i].year}" name="file_subscriptionHistList" value="${channelData.channelId}_${channelData.yearData[i].year}" checked />
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
        subscriptionHistListHtml += `
        <tr>
            <td colspan="3">
                <p>저장된 데이터가 없습니다.</p>
            </td>
        </tr>`;
    }
    
    document.getElementById("subscriptionHistList").innerHTML = subscriptionHistListHtml;
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
                            channel.subscription1000 ? 'src="./images/gift_sub_1000.png"' :
                            channel.subscription500 ? 'src="./images/gift_sub_500.png"' :
                            channel.subscription250 ? 'src="./images/gift_sub_250.png"' :
                            channel.subscription100 ? 'src="./images/gift_sub_100.png"' :
                            channel.subscription50 ? 'src="./images/gift_sub_50.png"' :
                            channel.subscription10 ? 'src="./images/gift_sub_10.png"' :
                            channel.subscription1 ? 'src="./images/gift_sub_1.png"' : ''
                        }
                    >
                    <img id="channelImg" src="${channel.channelImageUrl}" />
                </span>
                <p>${channel.channelName}</p>
                <p>총 ${Number(channel.channelTotal).toLocaleString("ko-KR")}회</p>
            </button>
        `).join('')}
    </div>`;

    return html;
}

function getChannelHistory(channelId) {
    let channelInfoYear = '';
    channel = channels.find(channel => channel.channelId === channelId);
    
    document.getElementById("channelHistoryWrap").dataset.visible = "block";
    document.getElementById("channelInfo").innerText = `${channel.channelName} 구독선물 횟수 : ${Number(channel.channelTotal).toLocaleString("ko-KR")}회(ALL) / ${Number(channel.channelCount1).toLocaleString("ko-KR")}회(1T) / ${Number(channel.channelCount2).toLocaleString("ko-KR")}회(2T)`;

    if(channel.yearData.length > 0) {
        let yearIdx = -1;
        for(let year of yearArr) {
            yearIdx = channel.yearData.findIndex(data => data.year === year);
            if(yearIdx !== -1) {
                channelInfoYear += `<li>${channel.yearData[yearIdx].year}년 : ${Number(channel.yearData[yearIdx].yearTotal).toLocaleString("ko-KR")}회(ALL) / ${Number(channel.yearData[yearIdx].yearCount1).toLocaleString("ko-KR")}회(1T) / ${Number(channel.yearData[yearIdx].yearCount2).toLocaleString("ko-KR")}회(2T)</li>`;
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
                            return `총 구독선물 횟수: ${tooltipItem.formattedValue}회`;
                        },
                        footer: function(tooltipItem) {
                            let year = Number(tooltipItem[0].dataset.label.replace(/[^0-9]/g, ''));
                            let yearData = channel.yearData.find(data => data.year === year);
                            let dataIdx = tooltipItem[0].dataIndex;
                            let monthCount = ["", "", "", "", "", "", "", "", "", "", "", ""];

                            if(yearData) {
                                let monthData = null;
                                for(let month of monthArr) {
                                    monthData = yearData.monthData.find(data => data.month === month);
                                    if(monthData) {
                                        monthCount[month - 1] = `${monthData.monthCount1}회(1T) / ${monthData.monthCount2}회(2T)`;
                                    }
                                }
                            }

                            return `티어별 구독선물 횟수: ${monthCount[dataIdx]}`;
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
                        text: '구독선물 횟수'
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

        document.getElementsByClassName("calendar_month_total")[0].innerHTML = monthData ? `<h3>${month}월 구독선물 횟수 : ${Number(monthData.monthTotal).toLocaleString("ko-KR")}회(All) / ${Number(monthData.monthCount1).toLocaleString("ko-KR")}회(1T) / ${Number(monthData.monthCount2).toLocaleString("ko-KR")}회(2T)</h3>` : `<h3>${month}월 구독선물 횟수 : 0회(All) / 0회(1T) / 0회(2T)</h3>`;
        document.getElementsByClassName("subscription_history")[0].innerHTML = `
        <ul>
            <li><button onclick="goToday();"><h4>TODAY</h4></button></li>
            ${channel.subscription1 ? `<li><button onclick="goDate('${channel.subscriptionDate1}');"><img src="./images/gift_sub_1.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.subscription10 ? `<li><button onclick="goDate('${channel.subscriptionDate10}');"><img src="./images/gift_sub_10.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.subscription50 ? `<li><button onclick="goDate('${channel.subscriptionDate50}');"><img src="./images/gift_sub_50.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.subscription100 ? `<li><button onclick="goDate('${channel.subscriptionDate100}');"><img src="./images/gift_sub_100.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.subscription250 ? `<li><button onclick="goDate('${channel.subscriptionDate250}');"><img src="./images/gift_sub_250.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.subscription500 ? `<li><button onclick="goDate('${channel.subscriptionDate500}');"><img src="./images/gift_sub_500.png" class="cheese_history_button"></button></li>` : ''}
            ${channel.subscription1000 ? `<li><button onclick="goDate('${channel.subscriptionDate1000}');"><img src="./images/gift_sub_1000.png" class="cheese_history_button"></button></li>` : ''}
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
                        ${channel.subscription1 && channel.subscriptionDate1 === makeDate(year, month, date) ? '<img src="./images/gift_sub_1.png" class="cheeseDate">' : ''}
                        ${channel.subscription10 && channel.subscriptionDate10 === makeDate(year, month, date) ? '<img src="./images/gift_sub_10.png" class="cheeseDate">' : ''}
                        ${channel.subscription50 && channel.subscriptionDate50 === makeDate(year, month, date) ? '<img src="./images/gift_sub_50.png" class="cheeseDate">' : ''}
                        ${channel.subscription100 && channel.subscriptionDate100 === makeDate(year, month, date) ? '<img src="./images/gift_sub_100.png" class="cheeseDate">' : ''}
                        ${channel.subscription250 && channel.subscriptionDate250 === makeDate(year, month, date) ? '<img src="./images/gift_sub_250.png" class="cheeseDate">' : ''}
                        ${channel.subscription500 && channel.subscriptionDate500 === makeDate(year, month, date) ? '<img src="./images/gift_sub_500.png" class="cheeseDate">' : ''}
                        ${channel.subscription1000 && channel.subscriptionDate1000 === makeDate(year, month, date) ? '<img src="./images/gift_sub_1000.png" class="cheeseDate">' : ''}
                    </span>` : ''}
                </h4>
        </span>`;

        dates[i] += `<div class="date_inner"><ul>`;
        
        if(monthData) {
            dayData = monthData.dayData.find(data => data.day === date);
            if(i >= firstDateIndex && i < lastDateIndex + 1 && dayData) {
                dates[i] += `
                    <li>ALL : ${dayData.dayTotal}회</li>
                    <li>1T : ${dayData.dayCount1}회</li>
                    <li>2T : ${dayData.dayCount2}회</li>
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
    document.querySelector(".popup_dimmed").dataset.visible = "flex";
    loadLocalStorageDataList();
}

function closeManageLocalStorage() {
    document.body.removeAttribute("style");
    document.querySelector(".popup_dimmed").dataset.visible = "none";
}

function loadLocalStorageDataList() {
    let tmpChannels = [];
    let channelData = null;
    let channelId = null;
    let channelName = null;
    let channelYear = null;
    let channelYearDataArr = null;
    let subscriptionHistListHtml = '';
    let cnt = 1;
    
    let localStorageKeys = Object.keys(localStorage);
    for(let key of localStorageKeys) {
        if(key.indexOf('_subscription') > -1) {
            channelData = getLocalStorageChannelData(key);
            if(!channelData.yearData || channelData.yearData.length === 0) localStorage.removeItem(key);
        }
    }
    localStorageKeys = Object.keys(localStorage);
    
    if(localStorageKeys.length > 0) {
        for(let key of localStorageKeys) {
            if(key.indexOf('_subscription') > -1) {
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
                    
                    subscriptionHistListHtml += `
                    <tr>
                        <td>${cnt++}</td>
                        <td>${channelName}</td>
                        <td>${channelYear}년</td>
                        <td>
                            <div class="check-box">
                                <label for="localStorage_${channelId}_${channelYear}">
                                    <input type="checkbox" id="localStorage_${channelId}_${channelYear}" name="localStorage_subscriptionHistList" value="${channelId}_${channelYear}" checked />
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
            subscriptionHistListHtml += `
            <tr>
                <td colspan="3">
                    <p>저장된 데이터가 없습니다.</p>
                </td>
            </tr>`;
        }
    } else {
        subscriptionHistListHtml += `
        <tr>
            <td colspan="3">
                <p>저장된 데이터가 없습니다.</p>
            </td>
        </tr>`;
    }
    
    document.getElementById("subscriptionHistLocalStorageList").innerHTML = subscriptionHistListHtml;
    document.getElementById("localStorage_allCheck").checked = true;
}

function allCheck(id) {
    let isChecked = document.getElementById(id).checked;

    if("file_allCheck" === id) {
        document.querySelectorAll("input[name='file_subscriptionHistList']").forEach((input) => {
            input.checked = isChecked;
        });
    } else if("localStorage_allCheck") {
        document.querySelectorAll("input[name='localStorage_subscriptionHistList']").forEach((input) => {
            input.checked = isChecked;
        });
    }
}

function getLocalStorageChannelData(channelId) {
    return JSON.parse(decodeURIComponent(localStorage.getItem(channelId)));
}

function saveLocalStorage() {
    let checkedList = document.querySelectorAll("input[name='file_subscriptionHistList']:checked");
    
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
                console.log();
                setLocalStorage(`${channelId}_subscription`, yearParam, channelData);
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
    let checkedList = document.querySelectorAll("input[name='localStorage_subscriptionHistList']:checked");
    
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
                    channelData = getLocalStorageChannelData(`${deleteData.channelId}_subscription`);
                    for(let year of deleteData.year) {
                        yearDataIndex = channelData.yearData.findIndex(yearData => yearData.year === year);
                        if(yearDataIndex !== -1) {
                            channelData.yearData.splice(yearDataIndex, 1);
                        }
                        yearDataIndex = -1;
                    }
                    
                    localStorage.setItem(`${channelData.channelId}_subscription`, encodeURIComponent(JSON.stringify(channelData)));
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
    let checkedList = document.querySelectorAll("input[name='localStorage_subscriptionHistList']:checked");
    
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
                localChannelData = getLocalStorageChannelData(`${checkedData.channelId}_subscription`);

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
            channel.channelCount1 = 0;
            channel.channelCount2 = 0;
            channel.subscription1 = false;
            channel.subscriptionDate1 = null;
            channel.subscription10 = false;
            channel.subscriptionDate10 = null;
            channel.subscription50 = false;
            channel.subscriptionDate50 = null;
            channel.subscription100 = false;
            channel.subscriptionDate100 = null;
            channel.subscription250 = false;
            channel.subscriptionDate250 = null;
            channel.subscription500 = false;
            channel.subscriptionDate500 = null;
            channel.subscription1000 = false;
            channel.subscriptionDate1000 = null;

            channel.yearData.sort((a, b) => a.year - b.year);

            for(let year of yearArr) {
                let yearData = channel.yearData.find(data => data.year === year);
                if(yearData) {
                    for(let month of monthArr) {
                        let monthData = yearData.monthData.find(data => data.month === month);
                        
                        if(monthData && monthData.dayData) {
                            for(let dayData of monthData.dayData) {
                                channel.channelTotal += dayData.dayTotal;
                                channel.channelCount1 += dayData.dayCount1;
                                channel.channelCount2 += dayData.dayCount2;
                                
                                if(!channel.subscription1 && channel.channelTotal >= 1) {
                                    channel.subscription1 = true;
                                    channel.subscriptionDate1 = makeDate(year, month, dayData.day);
                                }

                                if(!channel.subscription10 && channel.channelTotal >= 10) {
                                    channel.subscription10 = true;
                                    channel.subscriptionDate10 = makeDate(year, month, dayData.day);
                                }

                                if(!channel.subscription50 && channel.channelTotal >= 50) {
                                    channel.subscription50 = true;
                                    channel.subscriptionDate50 = makeDate(year, month, dayData.day);
                                }

                                if(!channel.subscription100 && channel.channelTotal >= 100) {
                                    channel.subscription100 = true;
                                    channel.subscriptionDate100 = makeDate(year, month, dayData.day);
                                }

                                if(!channel.subscription250 && channel.channelTotal >= 250) {
                                    channel.subscription250 = true;
                                    channel.subscriptionDate250 = makeDate(year, month, dayData.day);
                                }

                                if(!channel.subscription500 && channel.channelTotal >= 500) {
                                    channel.subscription500 = true;
                                    channel.subscriptionDate500 = makeDate(year, month, dayData.day);
                                }

                                if(!channel.subscription1000 && channel.channelTotal >= 1000) {
                                    channel.subscription1000 = true;
                                    channel.subscriptionDate1000 = makeDate(year, month, dayData.day);
                                }
                            }   // for(let dayData of monthData.dayData)
                        }   // if(monthData && monthData.dayData)
                    }   // for(let month of monthArr)
                }   // if(yearData)
            }   // for(let year of yearArr)
        }   // for(let channel of channels)
    }   // if(channels[0] !== '')
}

function createNewChannelData(channelData) {
    return {
        channelId: channelData.channelId,
        channelName: channelData.channelName,
        channelImageUrl: channelData.channelImageUrl,
        channelTotal: 0,
        channelCount1: 0,
        channelCount2: 0,
        subscription1: false,
        subscriptionDate1: null,
        subscription10: false,
        subscriptionDate10: null,
        subscription50: false,
        subscriptionDate50: null,
        subscription100: false,
        subscriptionDate100: null,
        subscription250: false,
        subscriptionDate250: null,
        subscription500: false,
        subscriptionDate500: null,
        subscription1000: false,
        subscriptionDate1000: null,
        yearData: []
    }
}

function returnSelectboxIconArrow() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
        <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
    </svg>`;
}
