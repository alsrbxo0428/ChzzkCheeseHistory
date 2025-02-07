## 치지직 치즈 후원 내역
링크 : https://alsrbxo0428.github.io/ChzzkCheeseHistory/

개인적으로 스트리머별 후원 내역을 확인하고 싶어 제작했으며, Windows OS 및 PC에서의 사용을 전제로 제작하였습니다.\
추후 치지직의 API 데이터 제공 방식 및 구조가 변경될 경우 기능이 정상적으로 동작하지 않을 수 있습니다.

사용한 오픈소스 라이브러리
- `Chart.js`

favicon 이미지 생성
- `ChatGPT`

## 업데이트 내역

### 2025.02.07
- 쿠키 관리 기능 개발중
- 채널 리스트 CSS 수정
    - 정렬 radio 버튼
    - 각 스트리머 이미지 버튼
- 그 외 기타 CSS 수정

### 2025.02.05
- 달력 오늘 날짜 테두리 표시
- 첫 후원 날짜 팬 이미지 표시 (등록한 JSON 데이터 기준)

### 2025.02.04
- 달력 생성
    - 월 총 후원 금액 출력
    - 일일최고후원금액 표시 및 이동 버튼 생성
    - 각 치즈별 달성일 이동 버튼 생성
    - 날짜 별 후원 금액 및 횟수 출력
    - 각 치즈 달성일 날짜 옆 치즈 이미지 표시 (등록한 JSON 데이터 기준)
- 기타 CSS 수정

### 2025.02.03
- 채널 리스트과 후원내역 그래프 영역 분리
- 그래프, 달력 탭 버튼 생성
- 기타 CSS 수정

### 2025.02.02
- 버튼 hover 효과 추가
- 파일 선택 버튼 변경

### 2025.01.30
- 치지직 스튜디오를 참고하여 디자인 수정
- json 데이터 -> 객체 배열 변환 로직 수정
- 치즈 내역 데이터 객체 배열 구조 변경
    - 일별 후원 금액 및 횟수 추가
    - 노랑 치즈, 분홍 치즈 달성 일자 추가
- favicon 이미지 변경

### 2025.01.25
- 스트리머 목록의 정렬방식 선택 추가
    - 닉네임 오름차순
    - 후원금액 내림차순
- 사용방법 업데이트

### 2025.01.22
- 스트리머 이미지 좌측상단에 치즈 이미지 추가

### 2025.01.04
- inline styles 를 class명으로 사용하도록 수정
- 치지직 치즈 사용 내역 페이지 이동 버튼 추가
- 개인 사용 목적 문구 추가

### 2025.01.03
- 툴팁 내용 수정
    - {`title`: '연월', `label`: '월 후원 금액', `footer`: '월 후원 횟수'}

### 2025.01.02
- 여러 개의 JSON 파일을 한 번에 등록 가능하도록 코드 수정
- 연도 별로 그래프 표출되도록 구현

### 2024.12.31
- 가로 막대 그래프에서 세로 막대 그래프로 변경
- 스트리머 별 연간 후원 횟수 추가

### 2024.12.31
- 최초 커밋