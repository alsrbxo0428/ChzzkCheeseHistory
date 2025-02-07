var channels = [];
var channel = null;
var selectboxFlag = true;
var selectboxFlag2 = true;
var selectboxFlag3 = true;
const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const yearArr = [2023, 2024, 2025];
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var calendarDate = `${year}-${month}`;

chgSearchYear(year);
chgCalendarYear(year);
chgCalendarMonth(month);

document.getElementsByClassName("selectbox_component")[0].addEventListener("focus", handleFocusChange);
document.getElementsByClassName("selectbox_component")[0].addEventListener("blur", handleFocusChange);

document.getElementsByClassName("selectbox_component")[1].addEventListener("focus", handleFocusChange2);
document.getElementsByClassName("selectbox_component")[1].addEventListener("blur", handleFocusChange2);

document.getElementsByClassName("selectbox_component")[2].addEventListener("focus", handleFocusChange3);
document.getElementsByClassName("selectbox_component")[2].addEventListener("blur", handleFocusChange3);

document.getElementById("size").addEventListener("focus", handleFocusChange4);
document.getElementById("size").addEventListener("blur", handleFocusChange4);

function openProfile() {
    document.getElementById("profileUrl").click();
}

function chgUrl() {
    document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
}

function chgSearchYear(localYear) {
    document.getElementById("searchYear").value = localYear;
    document.getElementsByClassName("selectbox_inner")[0].innerHTML = ` ${localYear}년
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
            <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
        </svg>`;

    selectboxToggle();
    chgUrl();
}

function chgCalendarYear(localYear) {
    document.getElementsByClassName("selectbox_inner")[1].innerHTML = ` ${localYear}년
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
            <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
        </svg>`;

    year = localYear;
    selectboxToggle2();
}

function chgCalendarMonth(localMonth) {
    document.getElementsByClassName("selectbox_inner")[2].innerHTML = ` ${localMonth}월
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
            <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
        </svg>`;

    month = localMonth;
    selectboxToggle3();
}

function handleFocusChange(event) {
    if (event.type === "focus") {
        document.getElementsByClassName("selectbox_component")[0].classList.add("selectbox_is_focused");
    } else if (event.type === "blur") {
        document.getElementsByClassName("selectbox_component")[0].classList.remove("selectbox_is_focused");
        setTimeout(function() {
            if(selectboxFlag) selectboxToggle();
        }, 100);
    }
}

function handleFocusChange2(event) {
    if (event.type === "focus") {
        document.getElementsByClassName("selectbox_component")[1].classList.add("selectbox_is_focused");
    } else if (event.type === "blur") {
        document.getElementsByClassName("selectbox_component")[1].classList.remove("selectbox_is_focused");
        setTimeout(function() {
            if(selectboxFlag2) selectboxToggle2();
        }, 100);
    }
}

function handleFocusChange3(event) {
    if (event.type === "focus") {
        document.getElementsByClassName("selectbox_component")[2].classList.add("selectbox_is_focused");
    } else if (event.type === "blur") {
        document.getElementsByClassName("selectbox_component")[2].classList.remove("selectbox_is_focused");
        setTimeout(function() {
            if(selectboxFlag3) selectboxToggle3();
        }, 100);
    }
}

function handleFocusChange4(event) {
    if (event.type === "focus") {
        document.getElementById("size").closest(".search_wrapper").classList.add("search_is_focused");
    } else if (event.type === "blur") {
        document.getElementById("size").closest(".search_wrapper").classList.remove("search_is_focused");
    }
}

function selectboxToggle() {
    selectboxFlag = !selectboxFlag;
    document.getElementsByClassName("selectbox_layer")[0].style.display = selectboxFlag ? "block" : "none";
}

function selectboxToggle2() {
    selectboxFlag2 = !selectboxFlag2;
    document.getElementsByClassName("selectbox_layer")[1].style.display = selectboxFlag2 ? "block" : "none";
}

function selectboxToggle3() {
    selectboxFlag3 = !selectboxFlag3;
    document.getElementsByClassName("selectbox_layer")[2].style.display = selectboxFlag3 ? "block" : "none";
}

function openHistory() {
    if(document.getElementById("size").value == null || document.getElementById("size").value == '') {
        document.getElementById("size").value = 10000;
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
    }

    document.getElementById("apiLink").click();
}

function addFile() {
    document.getElementById("jsonFileInput").click();
}

function openManageCookie() {
    document.body.style.cssText = "overflow: hidden; position: fixed; top: 0; width: 100%; height: 100%;";
    document.querySelector(".popup_dimmed").style.display = "block";
}

function closeManageCookie() {
    document.body.removeAttribute("style");
    document.querySelector(".popup_dimmed").style.display = "none";
}

function saveCookie() {
    document.cookie = "key=value; path=/; domain=alsrbxo0428.github.io;";

    let hostname = window.location.hostname;
    let expiresString = new Date();
    expiresString.setDate(expiresString.getDate() + 30);

    let channelCookie = `${encodeURIComponent(JSON.stringify())}; expires=${expiresString.toUTCString()}; path=/; domain=${hostname}`;

}

function loadCookie() {
    let coockieChannels = document.cookie

    let cheeseHistList = `  <tr>
                                <td>${channel.channelName}</td>
                                <td>0000년</td>
                                <td>
                                    <div class="check-box">
                                        <label for="id_2024">
                                            <input type="checkbox" id="id_2024" name="cookieCheckbox" value="id_2024" />
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

function changeSortType() {
    document.getElementById("channelListContainer").innerHTML = makeList(channels);
}

function chgView(type) {
    if(type === 'Graph') {
        document.getElementById("graphBtn").classList.add("on");
        document.getElementById("calendarBtn").classList.remove("on");
        document.getElementById("channelHistory").style.display = "block";
        document.getElementById("channelHistoryCalendar").style.display = "none";
        document.getElementsByClassName("selectbox")[0].style.display = "none";
    } else if(type === 'Calendar') {
        document.getElementById("graphBtn").classList.remove("on");
        document.getElementById("calendarBtn").classList.add("on");
        document.getElementById("channelHistory").style.display = "none";
        document.getElementById("channelHistoryCalendar").style.display = "block";
        document.getElementsByClassName("selectbox")[0].style.display = "block";
    }
}

function chgCalendarDate(year, month, focusDay) {
    document.getElementsByClassName("calendarDate")[0].innerText = `${year}년 ${month}월`;
    document.getElementsByClassName("selectbox_inner")[1].innerHTML = ` ${year}년
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
            <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
        </svg>`;
    document.getElementsByClassName("selectbox_inner")[2].innerHTML = ` ${month}월
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" class="selectbox_icon_arrow">
            <path fill="currentColor" fill-rule="evenodd" d="M.21 2.209a.715.715 0 0 1 1.01 0L5 5.983 8.78 2.21a.715.715 0 0 1 1.01 0 .712.712 0 0 1 0 1.008L5 8 .21 3.217a.712.712 0 0 1 0-1.008Z" clip-rule="evenodd"></path>
        </svg>`;

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

function goDate(localYear, localMonth, focusDay) {
    year = localYear;
    month = localMonth;

    chgCalendarDate(year, month, focusDay);
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
                <li><button onclick="goDate(${makeDateStringToParameter(channel.onedayMaxCheeseDate)})"><h4>일일최고후원금액 : ${Number(channel.onedayMaxCheese).toLocaleString("ko-KR")}원</h4></button></li>
                ${channel.cheese01 ? `<li><button onclick="goDate(${makeDateStringToParameter(channel.cheeseDate01)})"><img src="./images/cheese01.png" class="cheese_history_button"></button></li>` : ''}
                ${channel.cheese02 ? `<li><button onclick="goDate(${makeDateStringToParameter(channel.cheeseDate02)})"><img src="./images/cheese02.png" class="cheese_history_button"></button></li>` : ''}
                ${channel.cheese03 ? `<li><button onclick="goDate(${makeDateStringToParameter(channel.cheeseDate03)})"><img src="./images/cheese03.png" class="cheese_history_button"></button></li>` : ''}
                ${channel.cheese04 ? `<li><button onclick="goDate(${makeDateStringToParameter(channel.cheeseDate04)})"><img src="./images/cheese04.png" class="cheese_history_button"></button></li>` : ''}
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

        dates[i] += `<span class="${condition}"><h4>${date} 
                ${i >= firstDateIndex && i < lastDateIndex + 1 && channel ? (
                    channel.cheese04 && channel.cheeseDate04 === makeDate(year, month, date) ? '<img src="./images/cheese04.png" class="cheeseDate">' :
                    channel.cheese03 && channel.cheeseDate03 === makeDate(year, month, date) ? '<img src="./images/cheese03.png" class="cheeseDate">' :
                    channel.cheese02 && channel.cheeseDate02 === makeDate(year, month, date) ? '<img src="./images/cheese02.png" class="cheeseDate">' :
                    channel.cheese01 && channel.cheeseDate01 === makeDate(year, month, date) ? '<img src="./images/cheese01.png" class="cheeseDate">' : 
                    channel.firstCheeseDate === makeDate(year, month, date) ? '<img src="./images/fan_03.png" class="cheeseDate">' : ''
                ) : ''}
            </h4></span>`;

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

async function readFile(event) {
    const files = event.target.files;
    document.getElementById("fileList").innerText = `등록된 파일: ${files.length}건`;
    const cheeseDataArr = await processFiles(files);
    let totalPayAmount = 0;
    
    channels = [];
    document.getElementById("channelHistoryWrap").style.display = "none";

    if(cheeseDataArr) {
        cheeseDataArr.sort((a, b) => {
            if(a.purchaseDate < b.purchaseDate) return -1;
            if(a.purchaseDate > b.purchaseDate) return 1;
            return 0;
        });

        for(let cheeseData of cheeseDataArr) {
            let splitedPurchaseDate = cheeseData.purchaseDate.split(' ')[0];
            let splitedPurchaseDate2 = cheeseData.purchaseDate.split(' ')[0].split('-');
            let purchaseYear = Number(splitedPurchaseDate2[0]);
            let purchaseMonth = Number(splitedPurchaseDate2[1]);
            let purchaseDay = Number(splitedPurchaseDate2[2]);
            let payAmount = Number(cheeseData.payAmount);
            
            totalPayAmount += payAmount;

            let channelData = channels.find(channel => channel.channelId === cheeseData.channelId);
            if(!channelData) {
                channelData = {
                    channelId: cheeseData.channelId,
                    channelName: cheeseData.channelName,
                    channelImageUrl: cheeseData.channelImageUrl,
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
                channels.push(channelData);
            }

            channelData.channelTotal += payAmount;
            channelData.channelCount++;

            if(!channelData.firstCheeseDate) channelData.firstCheeseDate = splitedPurchaseDate;
            else if(!channelData.firstCheeseDate.localeCompare(splitedPurchaseDate)) channelData.firstCheeseDate = splitedPurchaseDate;

            if(!channelData.cheese01 && channelData.channelTotal > 100_000) {
                channelData.cheese01 = true;
                channelData.cheeseDate01 = splitedPurchaseDate;
            }

            if(!channelData.cheese02 && channelData.cheese01 && channelData.channelTotal > 1_000_000) {
                channelData.cheese02 = true;
                channelData.cheeseDate02 = splitedPurchaseDate;
            }

            if(!channelData.cheese03 && channelData.cheese02 && channelData.channelTotal > 10_000_000) {
                channelData.cheese03 = true;
                channelData.cheeseDate03 = splitedPurchaseDate;
            }

            if(!channelData.cheese04 && channelData.cheese03 && channelData.channelTotal > 100_000_000) {
                channelData.cheese04 = true;
                channelData.cheeseDate04 = splitedPurchaseDate;
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

    if(window.monthlyChart instanceof Chart) {
        window.monthlyChart.destroy();
    }

    document.getElementById("channelInfo").innerText = '';
    document.getElementById("channelInfoYear").innerText = '';
    document.getElementById("totalPayAmount").innerText = `전체 후원 금액 : ${totalPayAmount.toLocaleString("ko-KR")}원`;
    document.getElementById("channelListContainer").innerHTML = makeList(channels);
    document.getElementById("channelListContainer").style.display = "block";

    for(let channelData of channels) {
        for(let year of yearArr) {
            let yearData = channelData.yearData.find(data => data.year === year);
            if(yearData) {
                for(let month of monthArr) {
                    let monthData = yearData.monthData.find(data => data.month === month);
                    if(monthData && monthData.dayData) {
                        for(let data of monthData.dayData) {
                            if(channelData.onedayMaxCheese < data.dayTotal) {
                                channelData.onedayMaxCheese = data.dayTotal;
                                channelData.onedayMaxCheeseDate = makeDate(year, month, data.day);
                            }
                        }
                    }
                }
            }
        }
    }

    

    console.log(channels);
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

function makeList(channels) {
    let sortType = document.querySelector("input[name='sortType']:checked")?.value;
    let sortedChannels = [...channels];

    switch (sortType) {
        case 'total':
            sortedChannels.sort((a, b) => b.channelTotal - a.channelTotal);
            break;
        case 'name':
            sortedChannels.sort((a, b) => a.channelName.localeCompare(b.channelName));
            break;
    }

    let html = `<div id="channelList">
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
    
    document.getElementById("channelHistoryWrap").style.display = "block";
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

function makeDate(year, month, date) {
    return `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
}

function makeDateStringToParameter(date) {
    let splitedDate = date.split("-");

    return `${Number(splitedDate[0])}, ${Number(splitedDate[1])}, ${Number(splitedDate[2])}`;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}


function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };
  
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
  
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function deleteAllCookies() {
    let cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
       let cookie = cookies[i];
       let eqPos = cookie.indexOf("=");
       let name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

       deleteCookie(name.trim());
    }
}
