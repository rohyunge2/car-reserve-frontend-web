import { useState } from "react"
import * as config from '../../config';
import { ko } from "date-fns/esm/locale";
import DatePicker from "react-datepicker";
import { IoIosCalendar, IoIosClose } from "react-icons/io"


export default function Excel(props) {

  // State 생성
  const [date, setDate] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth()-1)),
    endDate: new Date(),
    periodOption: 1,
  });

  if ( !props.popup ){
    return null;
  }

  const dateFormat = (paramDate) => {
    return paramDate.getFullYear() + "-" + ((paramDate.getMonth()+1)< 10? "0"+(paramDate.getMonth()+1) : (paramDate.getMonth()+1)) + "-" + (paramDate.getDate() < 10 ? "0"+paramDate.getDate() : paramDate.getDate())
  }

  const excelDownLoad = () => {
    window.location.href= config.API_URL + "/api/car-excel/from/"+dateFormat(date.startDate)+"/to/"+dateFormat(date.endDate);
  }

  const onChangeStartDate = (paramDate, direct) => {

    const gap = paramDate.getTime() - date.endDate.getTime(); 
    
    if ( gap > 0 ){
      alert("올바른 날짜를 선택해주세요.");
      return;
    } else if ( gap < -7776000000 ) {
      alert("기간은 최대 3개월까지만 조회 가능합니다.");
      return;
    } else {
      setDate({...date, startDate: paramDate, periodOption: direct? 4: date.periodOption});
    }

  }

  const onChangeEndDate = (paramDate, direct) => {

    const gap = paramDate.getTime() - date.startDate.getTime(); 

    if ( gap < 0 ){
      alert("올바른 날짜를 선택해주세요.");
      return;
    } else if ( gap > 7776000000 ) {
      alert("기간은 최대 3개월까지만 조회 가능합니다.");
      return;
    } else {
      setDate({...date, endDate: paramDate, periodOption: direct? 4: date.periodOption});
    }
    
  }

  const onClickPeriod = (monthAgo) => {
    let calcDate = new Date(date.endDate);

    calcDate.setMonth(calcDate.getMonth()-Number(monthAgo));

    if ( monthAgo < 4 ){
      setDate({...date, startDate: calcDate, periodOption: monthAgo});
    } else {
      setDate({...date, periodOption: monthAgo});
    }

  }

  const PeriodOptionJsx = () => {

    let className = "pointer periodOption";
    let selectedClassName = "pointer periodOption selectedPeriodOption";
    let jsx = [];

    for ( let i = 1; i < 4; i++ ){
      jsx.push(<div className={date.periodOption == i? selectedClassName:className} onClick={() => onClickPeriod(i)} key={i}>{i} 개월</div>);
    }
    jsx.push(<div className={date.periodOption == 4? selectedClassName:className} onClick={() => onClickPeriod(4)} key={4}>기간선택</div>);

    return (
      <div className="ml20 mt20 periodBox">
        {jsx}
      </div>
      )
  }

  return (
    <div id="dim2" className="dim line-height-normal" >
      <div id="excelPopup" className="excel-popup">

        <div><IoIosClose size="24" className="mr10 float-right pointer" color="#555" onClick={props.excelPopupToggle}/></div>

        <div className="m20 flex-vertical-center">
          <IoIosCalendar size="24" className="" color="#555"/>
          <DatePicker
            locale={ko}	// 언어설정 기본값은 영어
            dateFormat="yyyy-MM-dd"	// 날짜 형식 설정
            className="input-datepicker p5 input W_150"	// 클래스 명 지정 css주기 위해
            maxDate={new Date()}	// 선택할 수 있는 최소 날짜값 지정 
            closeOnScroll={true}	// 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
            placeholderText="날짜 선택"	// placeholder
            selected={date.startDate}
            onSelect={(selectedDate) => onChangeStartDate(selectedDate, true)}
          />
          <span className="ml10 mr10 C_555">-</span>
          <IoIosCalendar size="24" className="" color="#555"/>
          <DatePicker
            locale={ko}	// 언어설정 기본값은 영어
            dateFormat="yyyy-MM-dd"	// 날짜 형식 설정
            className="input-datepicker p5 input W_150"	// 클래스 명 지정 css주기 위해
            maxDate={new Date()}	// 선택할 수 있는 최소 날짜값 지정 
            closeOnScroll={true}	// 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
            placeholderText="날짜 선택"	// placeholder
            selected={date.endDate}
            onSelect={(selectedDate) => onChangeEndDate(selectedDate, true)}
          />
        </div>

        <PeriodOptionJsx/>

        <div className="ml20 mr20 mt20 f_11 color-grey">※ 기간은 최대 3개월까지만 조회 가능합니다.</div>

        <div className="btn-save pointer" onClick={excelDownLoad}>엑셀 다운로드</div>
        
      </div>
    </div>
  );

}
