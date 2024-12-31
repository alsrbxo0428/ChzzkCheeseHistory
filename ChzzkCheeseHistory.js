document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("searchYear").addEventListener("change", function() {
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
        document.getElementById("totalPayAmount").innerText = `${document.getElementById("searchYear").value}년 전체 후원 금액 : 0원`;
    });
    
    document.getElementById("size").addEventListener("change", function() {
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
    });
    
    document.getElementById("jsonFileInput").addEventListener("change", function(event) {
        const file = event.target.files[0];
        
        if(file) {
            let total = 0;
            
            const reader = new FileReader();
            
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
                    
                    let exits = false;
                    let channelIdx = -1;
                    content.data.forEach(function(item) {
                        total += Number(item.payAmount);
                        exits = channels.some(channel => channel.channelId === item.channelId);

                        if(!exits) {
                            channels.push({
                                channelId: item.channelId,
                                channelName: item.channelName,
                                channelImageUrl: item.channelImageUrl,
                                channelTotal: 0,
                                monthTotal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            });
                        }
                        
                        channelIdx = channels.findIndex(channel => channel.channelId === item.channelId);
                        if(channelIdx !== -1) {
                            channels[channelIdx].channelTotal += Number(item.payAmount);
                            channels[channelIdx].monthTotal[Number(item.purchaseDate.split('-')[1]) - 1] += Number(item.payAmount);
                        }
                    });
                    
                    document.getElementById("totalPayAmount").innerText = `${document.getElementById("searchYear").value}년 전체 후원 금액 : ${total.toLocaleString("ko-KR")}원`;
                    document.getElementById("channelList").innerHTML = makeList(channels);
                } catch (error) {
                    document.getElementById("channelList").innerHTML = `<h3>JSON 파일을 파싱하는 중 오류 발생: ${error.message}</h3>`;
                }
            };
    
            reader.onerror = function() {
                document.getElementById("channelList").innerHTML = "<h3>파일을 읽는 중 오류가 발생했습니다.</h3>";
            };
    
            reader.readAsText(file);
        } else {
            document.getElementById("channelList").innerHTML = "<h3>선택된 파일이 없습니다.</h3>";
        }
    });
});

var channels = [];

function openHistory() {
    if(document.getElementById("size").value == null || document.getElementById("size").value == '') {
        document.getElementById("size").value = 10000;
        document.getElementById("apiLink").href = `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${document.getElementById("size").value}&searchYear=${document.getElementById("searchYear").value}`;
    }

    document.getElementById("apiLink").click();
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

    document.getElementById("channelName").innerText = `${channel.channelName} 후원 금액 : ${Number(channel.channelTotal).toLocaleString("ko-KR")}원`;

    renderMonthlyChart(channel);
}

function renderMonthlyChart(channel) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');

    // 기존 그래프가 있으면 삭제
    if (window.monthlyChart instanceof Chart) {
        window.monthlyChart.destroy();
    }

    // 새 가로 막대 그래프 생성
    window.monthlyChart = new Chart(ctx, {
        type: 'bar', // Chart.js 3.x부터는 'horizontalBar' 대신 'bar'를 사용하며, 옵션으로 가로 설정
        data: {
            labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            datasets: [{
                label: `${channel.channelName}의 월별 후원 금액`,
                data: channel.monthTotal,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // 가로 막대 설정
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '후원 금액 (원)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '월'
                    }
                }
            }
        }
    });
}
