export default function Intro(props) {

	const closePopup = () => {
		window.close();
	}
  
  return (
		<div>
			<div style={{
				textAlign: "right",
    		margin: "20px 20px 0 0"}}>
				<span className="pointer" onClick={closePopup}>X</span>
			</div>
			<div style={{margin: "60px 80px 50px 80px"}}>
				<div style={{	fontFamily: "NanumSquareR",
											fontSize: "14px",
											fontWeight: "normal",
											fontStretch: "normal",
											fontStyle: "normal",
											lineHeight: "1.71",
											letterSpacing: "normal",
											textAlign: "left",
											color: "#5f6368",
											marginBottom: "50px"}}>
					이제는 url로 접속하여 회의실 예약 및 현황을 확인하세요. <br />
					이동의 불편함을 줄이고, <br />
					페이퍼 절약으로 환경도 조금은 보호할 수 있겠죠? <br />
					BNSoft가 슬기로운 회사생활을 위해 함께 합니다. 
				</div>
				<div style={{
					opacity:"0.6",
					fontFamily:"NanumSquareR",
					fontSize:"14px",
					fontWeight:"normal",
					fontStretch:"normal",
					fontStyle:"normal",
					lineHeight:"1.57",
					letterSpacing:"normal",
					textAlign:"left",
					color:" #5f6368"
				}}>
					※ 회의실 캘린더는 SSD 사업부에서 제공하였습니다. <br />
					※ UI는 오픈소스를 이용하였으며, 개발 언어는 GOLANG, <br />
					React(Web), Flutter(Mobile)를 사용하였습니다. <br />
					(참여 : 혱님, 아~마라탕, 긴수염짱, 영의네감자농장, 불꽃수염)
				</div>
			</div>
			<div style={{
          float:"right",
        }}>
          <div style={{
						width: "96px",
						height: "36px",
						lineHeight: "36px",
						border: "3px solid #CCC",
						borderRadius: "50px",
						textAlign: "center",
						margin:"0 20px 20px 0",
						color: "#444"
					}} className="pointer" onClick={closePopup}>닫기</div>
        </div>
		</div>
  );
}
