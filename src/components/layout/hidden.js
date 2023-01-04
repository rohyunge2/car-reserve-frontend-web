import react, { useState, useEffect } from "react"
import * as config from '../../config'
import axios from "axios";

export default function Hidden(props) {

  // State 생성
  const [inputs, setInputs] = useState({
    excelPopup: false,
    carInfo: []
  });

  // 최초 세팅
  useEffect(() => {
    getCarInfoList();
  }, []);
  
  const propsOpenCreationPopup = () => {
    props.openCreationPopup();
  }

  const excelPopupToggle = () => {
    setInputs({...inputs, excelPopup: !inputs.excelPopup});
  }

  const contentStyle = {
    lineHeight: "30px",
    textAlign: "left",
    display: "inline-block",
    fontSize: "12px",
    verticalAlign: "middle",
    position: "relative",
    paddingLeft: "8px",
  }

  const getCarInfoList = () => {

    axios
    .get(config.API_URL + "/api/car-info")
    .then((response) => {
      const data = response.data;

	  data.unshift({car_number:"차량선택"});
      if ( data.length > 0 ){
        setInputs({...inputs, 
          carInfo: data.map((obj, index) => <li className="tui-full-calendar-popup-section-item tui-full-calendar-dropdown-menu-item" key={index}>
												<span className="tui-full-calendar-icon tui-full-calendar-none"></span>
                        <span style={obj.car_model?contentStyle:{}}>{obj.car_model}</span>
												<span className="tui-full-calendar-content">{obj.car_number}</span>
											</li>)
        })     
      }

    })
  }

  const CarInfo = () => {
    return (<div className="none">
              	<div className="tui-full-calendar-popup-section tui-full-calendar-dropdown tui-full-calendar-close tui-full-calendar-section-carNumber" style={{width: "200px", float: "left", marginLeft: "12px"}} id="carInfoDataOri">
					<button className="tui-full-calendar-button tui-full-calendar-dropdown-button tui-full-calendar-popup-section-item" style={{width: "100%"}}>
						<span className="tui-full-calendar-icon tui-full-calendar-ic-car"></span>
						<span id="tui-full-calendar-carNumberOri" className="tui-full-calendar-content" style={{width: "148px"}}>차량선택</span>
						<span className="tui-full-calendar-icon tui-full-calendar-dropdown-arrow"></span>
					</button>
					<ul className="tui-full-calendar-dropdown-menu" id="carNumbersOri">
						{inputs.carInfo}
					</ul>
				</div>
            </div>);
  }

  return (
    <div className="none">
        <CarInfo />
    </div>
  );

}
