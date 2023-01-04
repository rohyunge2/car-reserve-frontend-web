import react, { useState, useEffect } from "react"
import * as config from '../../config'
import Excel from "../layout/excel"
import axios from "axios";

export default function Header(props) {

  // State 생성
  const [inputs, setInputs] = useState({
    excelPopup: false,
  });

  const propsOpenCreationPopup = () => {
    props.openCreationPopup();
  }

  const excelPopupToggle = () => {
    setInputs({...inputs, excelPopup: !inputs.excelPopup});
  }

  return (
    <div className="header">
        <span className="header-name">BNS 차량 예약 캘린더</span>
        <div className="btnReserveCar" onClick={propsOpenCreationPopup}>차량 예약</div>
        <div className="btnDownloadExcel" onClick={excelPopupToggle}>엑셀 다운로드</div>
        <Excel popup={inputs.excelPopup} excelPopupToggle={excelPopupToggle} />
    </div>
  );

}
