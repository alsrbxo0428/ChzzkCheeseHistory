var channels = [];

function openProfile() {
    document.getElementById("profileUrl").click();
}

function chgUrl() {
    document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
}

function openHistory() {
    if(document.getElementById("size").value == null || document.getElementById("size").value == '') {
        document.getElementById("size").value = 10000;
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
    }

    document.getElementById("apiLink").click();
}

function readFile(event) {
    const files = event.target.files;

    let file = null;
    let totalPayAmount = 0;
    for(let i = 0; i < files.length; i++) {
        if(i === 0) channels = [];
        file = files[i];

        if(file) {
            var reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    if(jsonData.code !== 200) {
                        document.getElementById("channelList").innerHTML = "<h3>잘못된 값을 입력했습니다.</h3>";
                        return false;
                    }
                    
                    const content = jsonData.content;
                    if(content.totalCount <= 0) {
                        document.getElementById("channelList").innerHTML = "<h3>등록된 데이터가 없습니다.</h3>";
                        return false;
                    }

                    if (window.monthlyChart instanceof Chart) {
                        window.monthlyChart.destroy();
                    }
                    document.getElementById("channelInfo").innerText = '';
                    document.getElementById("channelInfoYear").innerText = '';

                    let channelExist = false;
                    let channelIdx = -1;
                    let yearExist = false;
                    let yearIdx = -1;
                    let monthIdx = -1;

                    content.data.forEach(function(item) {
                        totalPayAmount += Number(item.payAmount);
                        
                        channelExist = channels.some(channel => channel.channelId === item.channelId);
                        if(!channelExist) {
                            channels.push({
                                channelId: item.channelId,
                                channelName: item.channelName,
                                channelImageUrl: item.channelImageUrl,
                                channelTotal: 0,
                                channelCount: 0,
                                yearData: []
                            });
                        }

                        channelIdx = channels.findIndex(channel => channel.channelId === item.channelId);
                        if(channelIdx !== -1) {
                            channels[channelIdx].channelTotal += Number(item.payAmount);
                            channels[channelIdx].channelCount += 1;
                            
                            yearExist = channels[channelIdx].yearData.some(data => data.year === Number(item.purchaseDate.split('-')[0]));
                            if(!yearExist) {
                                channels[channelIdx].yearData.push({
                                    year: Number(item.purchaseDate.split('-')[0]),
                                    yearTotal: 0,
                                    yearCount: 0,
                                    monthTotal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    monthCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                });
                            }

                            yearIdx = channels[channelIdx].yearData.findIndex(data => data.year === Number(item.purchaseDate.split('-')[0]));
                            if(yearIdx !== -1) {
                                channels[channelIdx].yearData[yearIdx].yearTotal += Number(item.payAmount);
                                channels[channelIdx].yearData[yearIdx].yearCount += 1;
                                
                                monthIdx = Number(item.purchaseDate.split('-')[1]) - 1;
                                if(monthIdx !== -1) {
                                    channels[channelIdx].yearData[yearIdx].monthTotal[monthIdx] += Number(item.payAmount);
                                    channels[channelIdx].yearData[yearIdx].monthCount[monthIdx] += 1;
                                }
                            }
                        }

                        channelExist = false;
                        channelIdx = -1;
                        yearExist = false;
                        yearIdx = -1;
                        monthIdx = -1;
                    });
                    
                    document.getElementById("totalPayAmount").innerText = `전체 후원 금액 : ${totalPayAmount.toLocaleString("ko-KR")}원`;
                    document.getElementById("channelList").innerHTML = makeList(channels);
                } catch (error) {
                    document.getElementById("channelList").innerHTML = `<h3>JSON 파일을 파싱하는 중 오류 발생: ${error.message}</h3>`;
                }
            }

            reader.onerror = function() {
                document.getElementById("channelList").innerHTML = "<h3>파일을 읽는 중 오류가 발생했습니다.</h3>";
            };
            
            reader.readAsText(file);
        }
    }
}

function makeList(channels) {
    let html = "";

    for(const channel of channels) {
        html += `<button onclick="getChannelHistory('${channel.channelId}');">
                    <img src="${channel.channelImageUrl}" />
                    <p>${channel.channelName}</p>
                </button>`;
    }

    return html;
}

function getChannelHistory(channelId) {
    let channel = channels.find(channel => channel.channelId === channelId);

    document.getElementById("channelInfo").innerText = `${channel.channelName} 총 후원 금액 : ${Number(channel.channelTotal).toLocaleString("ko-KR")}원 (${channel.channelCount}회)`;

    let channelInfoYear = '';
    if(channel.yearData.length > 0) {
        let yearIdx = -1;
        for(let option of document.getElementById("searchYear").children) {
            yearIdx = channel.yearData.findIndex(data => data.year === Number(option.value));
            if(yearIdx !== -1) {
                channelInfoYear += `<li>${channel.yearData[yearIdx].year}년 : ${Number(channel.yearData[yearIdx].yearTotal).toLocaleString("ko-KR")}원 (${channel.yearData[yearIdx].yearCount}회)</li>`;
                yearIdx = -1;
            }
        }
    }
    document.getElementById("channelInfoYear").innerHTML = channelInfoYear;
    
    renderMonthlyChart(channel);
}

function renderMonthlyChart(channel) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');

    if (window.monthlyChart instanceof Chart) {
        window.monthlyChart.destroy();
    }

    window.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            datasets: makeChartDatasets(channel)
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
                            let yearIdx = channel.yearData.findIndex(data => data.year === year);
                            let dataIdx = tooltipItem[0].dataIndex;

                            return `후원 횟수: ${channel.yearData[yearIdx].monthCount[dataIdx]}회`;
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

function makeChartDatasets(channel) {
    let datasets = [];
    let yearIdx = -1;
    for(let option of document.getElementById("searchYear").children) {
        yearIdx = channel.yearData.findIndex(data => data.year === Number(option.value));
        if(yearIdx !== -1) {
            datasets.push({
                label: `${channel.yearData[yearIdx].year}년`,
                data: channel.yearData[yearIdx].monthTotal
            });
            
            yearIdx = -1;
        }
    }

    return datasets;
}
