import React, { useState, useEffect } from "react";
import axios from "axios";

import Calendar from "@toast-ui/react-calendar";
import DatePicker from "react-datepicker";
import "tui-calendar/dist/tui-calendar.css";
import ReactLoading from 'react-loading';

// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import "react-datepicker/dist/react-datepicker.css";

import SideBar from "../layout/sideBar";
import Header from "../layout/header";
import Hidden from "../layout/hidden";
import myTheme from "./calendarTheme";
import * as config from '../../config';

import { ko } from "date-fns/esm/locale";
import { IoIosCalendar, IoIosPerson, IoMdCar,IoIosClose } from "react-icons/io"
import { IoReader, IoLocationSharp } from "react-icons/io5"
import { CgRuler } from "react-icons/cg"
import { BsFilterLeft } from "react-icons/bs"

export default function CalendarComp(props) {
  // State 생성
  const [inputs, setInputs] = useState({
    today: new Date(),
    schedule: [],
    refresh:true,
  });
  
  const calendarRef = React.createRef();
  const loadingRef = React.useRef();
  const scheduleArr = [];

  // 최초 세팅
  useEffect(() => {
  
  }, []);

  // 날짜 변경 콜백
  useEffect(() => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.setDate(inputs.today);

    axios
    .get(config.API_URL + "/api/car")
    .then((response) => {
      const data = response.data;

      if ( data.length > 0 ){

        data.forEach(val => {
          scheduleArr.push({
            id: val.reservation_id,
            calendarId: val.departments,
            purpose: val.purpose,
            userName: val.name,
            destinationArea: val.destination_area,
            category: "time",
            start: new Date(val.start_date).toString(),
            end: new Date(val.end_date).toString(),
            isAllDay: val.is_all_day == "1" ? true : false,
            isReturn: val.is_return,
            carNumber: val.car_number
          })
        });
        
        scrollDown();
        calendarInstance.createSchedules(scheduleArr);

      }

    })
    
  }, [inputs.today, inputs.refresh]);

  const getDate = (unit, date, num, symbol) => {
    let todayDate = new Date(date);

    if (symbol == "-") {
      num = -num;
    }

    switch (unit) {
      case "date":
        todayDate.setDate(todayDate.getDate() + num);
        break;

      case "hours":
        todayDate.setHours(todayDate.getHours() + num);
        break;

      case "minutes":
        todayDate.setMinutes(todayDate.getMinutes() + num);
        break;
    }

    return todayDate;
  };

  const openCreationPopup = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.openCreationPopup([]);
  }

  const changeToday = (date) => {
    setInputs({
      ...inputs,
      today: date
    })
  }

  const goToday = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.today();
    setInputs({
      ...inputs,
      today: new Date()
    })
  };

  const goNextWeek = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.next();
    setInputs({
      ...inputs,
      today: getDate('date', inputs.today, 7, '+')
    })
  };

  const goPrevWeek = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.prev();
    setInputs({
      ...inputs,
      today: getDate('date', inputs.today, 7, '-')
    })
  };

  const isNull = (val) => {
    if ( val == "" || val == null || val == undefined ){
      return true;
    }
    return false;
  }

  const showLoading = () => {
    loadingRef.current.style.display = "flex";
  }

  const hideLoading = () => {
    loadingRef.current.style.display = "none";
  }

  const loading = () => {
    return (
      <div className="loading" style={{display:"none"}} ref={loadingRef}>
        <ReactLoading type={"spokes"} color="#222" />
      </div>
    )
  }

  const scrollDown = () => {
    if ( document.querySelector(".tui-full-calendar-timegrid-container") ) {
      document.querySelector(".tui-full-calendar-timegrid-container").scrollTop = 100000;
    }
  }
  scrollDown();

  const createSchedules = (event) => {

    const jsonData = {
      "departments": event.calendarId,
      "name": event.userName,
      "destination_area": event.destinationArea,
      "purpose":event.purpose,
      "is_all_day": event.isAllDay ? "1" : "0",
      "start_date" : getTimeStamp(event.start),
      "end_date" : getTimeStamp(event.end),
      "car_number" : event.carNumber
    }
    showLoading();

    axios
      .post(config.API_URL + "/api/car", jsonData)
      .then((response) => {
        if ( response.status == 200){
          alert("예약이 완료되었습니다.");
          refresh();
        } else {
          alert("선택한 시간에 이미 예약이 있습니다.\n예약한 담당자와 협의해주세요.");
        }
        
      })
      .catch((error) => {
        axiosError(error);
        alert("선택한 시간에 이미 예약이 있습니다.\n예약한 담당자와 협의해주세요.");
      }).finally(()=>{
        hideLoading();
      });
      
  };

  function fillZeros(n, digits) {  
      var zero = '';  
      n = n.toString();  

      if (n.length < digits) {  
          for (var i = 0; i < digits - n.length; i++)  
              zero += '0';  
      }  
      return zero + n;  
  }  
    
  function getTimeStamp(date) {  
      var d = new Date(date);  

      var s = fillZeros(d.getFullYear(), 4) + '-' +  
              fillZeros(d.getMonth() + 1, 2) + '-' +  
              fillZeros(d.getDate(), 2) + ' ' +  
        
              fillZeros(d.getHours(), 2) + ':' +  
              fillZeros(d.getMinutes(), 2) + ':' +  
              fillZeros(d.getSeconds(), 2);  

      return s;  
  }  

  const refresh = () => {
    setInputs({
      ...inputs,
      refresh: !inputs.refresh
    })
  }
  
  const onlyNumber = (obj) => {
    obj.target.value = obj.target.value.replace(/[^0-9]+/g, '');
  }

  const onlyNumberAndComma = (obj) => {
    obj.target.value = obj.target.value.replace(/[^0-9.]+/g, '');
  }

  const autoCalculate = () => {
    const after = Number(document.querySelector("#after").value);
    const before = Number(document.querySelector("#before").value);

    document.querySelector("#calculated").value = after - before > 0 ? after - before : 0;
  }

  const updateSchedule = (event) => {
    const calendarInstance = calendarRef.current.getInstance();

    const jsonData = {
      "departments": event.changes && event.changes.calendarId ? event.changes.calendarId : event.schedule.calendarId,
      "name": event.changes && event.changes.userName ? event.changes.userName : event.schedule.userName,
      "destination_area": event.changes && event.changes.destinationArea ? event.changes.destinationArea : event.schedule.destinationArea ,
      "purpose": event.changes && event.changes.purpose ? event.changes.purpose : event.schedule.purpose,
      "is_all_day": (event.changes && event.changes.isAllDay ? event.changes.isAllDay : event.schedule.isAllDay) ? "1" : "0",
      "start_date" : getTimeStamp(event.changes && event.changes.start ? event.changes.start : event.schedule.start),
      "end_date" : getTimeStamp(event.changes && event.changes.end ? event.changes.end : event.schedule.end),
      "car_number": event.changes && event.changes.carNumber ? event.changes.carNumber : event.schedule.carNumber,
    }
    console.log("event", event);
    console.log("jsonData", jsonData);
    showLoading();

    axios
      .put(config.API_URL + "/api/car/" + event.schedule.id, jsonData)
      .then((response) => {
        if ( response.data.message == "Fail"){
          alert("선택한 시간에 이미 예약완료 된 회의가 있습니다.\n예약한 담당자와 협의해주세요.");
        } else {
          calendarInstance.updateSchedule(event.schedule.id, event.schedule.calendarId, event.changes);
          refresh();
          alert("예약수정이 완료되었습니다.");
        }
      })
      .catch((error) => {
        axiosError(error);
      })
      .finally(()=>{
        hideLoading();
      });

  };

  const deleteSchedule = (event) => {
    if ( !window.confirm("예약취소 하시면 복구가 불가합니다.\n그래도 예약을 취소하시겠습니까?") ){
      return;
    }

    const calendarInstance = calendarRef.current.getInstance();

    showLoading();

    axios
      .delete(config.API_URL + "/api/car/"+ event.schedule.id)
      .then((response) => {
        calendarInstance.deleteSchedule(event.schedule.id, event.schedule.calendarId);
        refresh();
      })
      .catch((error) => {
        axiosError(error);
      })
      .finally(()=>{
        hideLoading();
      });
      
  };

  const axiosError = (error) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  };

  const resetReturn = () => {
    document.querySelector("#returnDate").value = new Date().getFullYear() + "-" + (new Date().getMonth()+1 > 9 ? new Date().getMonth()+1 : "0"+(new Date().getMonth()+1) ) + "-" + (new Date().getDate() > 9 ? new Date().getDate() : "0"+(new Date().getDate()) );
    document.querySelector("#departments").value = "";
    document.querySelector("#name").value = "";
    document.querySelector("#before").value = "";
    document.querySelector("#after").value = "";
    document.querySelector("#realDistance").value = "";
    document.querySelector("#locationFloor").value = "";
    document.querySelector("#locationArea").value = "";
    document.querySelector("#type").value = "";
    document.querySelector("#notes").value = "";
    document.querySelector("#reservationId").value = "";
    document.querySelector("#purpose").value = "";
    document.querySelector("#start").value = "";
    document.querySelector("#end").value = "";
    document.querySelector("#destinationArea").value = "";
    document.querySelector("#isAllDay").value = "";
    document.querySelector("#isUpdate").value = "0";
  }

  const popupClose = () => {

    resetReturn();

    document.querySelector("#dim").style.display = "none";

    refresh();
    
  }

  const saveReturn = () => {

    let returnDate = document.querySelector("#returnDate").value;
    let departments = document.querySelector("#departments").value;
    let name = document.querySelector("#name").value;
    let before = document.querySelector("#before").value;
    let after = document.querySelector("#after").value;
    let realDistance = document.querySelector("#realDistance").value;
    let locationFloor = document.querySelector("#locationFloor").value;
    let locationArea = document.querySelector("#locationArea").value;
    let type = document.querySelector("#type").value;
    let notes = document.querySelector("#notes").value;
    let reservationId = document.querySelector("#reservationId").value;

    const validArray = [
      [returnDate, "반납일자는 필수항목입니다."],
      [name, "반납자명은 필수항목입니다."],
      [locationFloor, "주차장은 필수항목입니다."],
      [locationArea, "주차구역은 필수항목입니다."],
      [before, "주행 전 거리는 필수항목입니다."],
      [after, "주행 후 거리는 필수항목입니다."],
      [type, "업무용도는 필수항목입니다."],
    ]

    const validResult = validArray.every(el => {
      const val = el[0];
      const alertText = el[1];

      if ( isNull(val) ){
        alert(alertText);
        return false;
      }
      return true;
    });

    if ( !validResult ){
      return;
    }

    const jsonData = {
      "return_date" : returnDate,
      "departments" : departments,
      "name" : name,
      "before" : before,
      "after" : after,
      "distance" : (Number(after) - Number(before))+"",
      "real_distance" : realDistance?realDistance:(Number(after) - Number(before))+"",
      "location_floor" : locationFloor,
      "location_area" : locationArea,
      "type" : type,
      "notes" : notes,
      "reservation_id" : reservationId
    }

    showLoading();
    if ( document.querySelector("#isUpdate").value != 1 ){
      axios
        .post(config.API_URL + "/api/car-return", jsonData)
        .then((response) => {
          if ( response.status == 200){
            alert("차량 반납이 완료되었습니다.");
            refresh();
            detailPopup();
          } else {
            alert("오류가 발생하였습니다.");
          }
          
        })
        .catch((error) => {
          axiosError(error);
        })
        .finally(()=>{
          hideLoading();
        });
    } else {
      axios
        .put(config.API_URL + "/api/car-return/"+reservationId, jsonData)
        .then((response) => {
          if ( response.status == 200){
            alert("차량 반납이 완료되었습니다.");
            refresh();
            detailPopup();
          } else {
            alert("오류가 발생하였습니다.");
          }
        })
        .catch((error) => {
          axiosError(error);
        })
        .finally(()=>{
          hideLoading();
        });
    }
  }

  const detailPopup = () => {

    let isAllDay = document.querySelector("#isAllDay").value;

    let startDate = new Date(document.querySelector("#start").value);
    let endDate = new Date(document.querySelector("#end").value);
    let returnDate = new Date(document.querySelector("#returnDate").value);

    startDate = getFormatDate(startDate, isAllDay);
    endDate = getFormatDate(endDate, isAllDay);
    returnDate = getFormatDate(returnDate, "2");

    let realDistance = document.querySelector("#realDistance").value;
    let before = document.querySelector("#before").value;
    let after = document.querySelector("#after").value;
    let distance = Number(realDistance) > 0 ? realDistance : Number(after) - Number(before);

    let type = document.querySelector("#type").value;
    type = type == 0 ? "일반 업무용" : type == 1 ? "출퇴근 사용" : "개인 사용";

    document.querySelector("#detailPurpose").innerHTML = document.querySelector("#purpose").value;
    document.querySelector("#detailDate").innerHTML = startDate + " ~ " + endDate + " / 반납 " + returnDate;
    document.querySelector("#detailDestinationArea").innerHTML = document.querySelector("#destinationArea").value;
    document.querySelector("#detailName").innerHTML = document.querySelector("#name").value;
    document.querySelector("#detailLocation").innerHTML = document.querySelector("#locationFloor").value + " / " + document.querySelector("#locationArea").value;
    document.querySelector("#detailDistance").innerHTML = distance;
    document.querySelector("#detailNotes").innerHTML = type + " / " +document.querySelector("#notes").value;

    document.querySelector("#detailPopup").style.display = "block";

  }

  const modifyPopup = () => {
    document.querySelector("#isUpdate").value = "1";
    document.querySelector("#detailPopup").style.display = "none";
  }

  const getFormatDate = (dateParam, type) => {
    var year = dateParam.getFullYear();
    var month = dateParam.getMonth() + 1;
    var date = dateParam.getDate();
    var hour = dateParam.getHours();
    var min = dateParam.getMinutes();
    var sec = dateParam.getSeconds();

    var week = ['일', '월', '화', '수', '목', '금', '토'];
    var dayOfWeek = week[dateParam.getDay()];

    switch (type) {
      case "1":
        return month + "월 " + date + "일 " + dayOfWeek + "요일";      
      case "2":
        return month + "월 " + date + "일";    
      default:
        return month + "월 " + date + "일 " + dayOfWeek + "요일 " + hour + "시";
    }
  }

  const MyComponent = () => (
    <Calendar
      ref={calendarRef}
      usageStatistics={false}
      theme={myTheme}
      height="1300px"
      calendars={[
        {
          id: "None",
          name: "부서선택",
          bgColor: "#555",
          borderColor: "#555",
          dragBgColor: '#555',
        },
        {
          id: "MD",
          name: "MD",
          bgColor: "#42a5f5",
          borderColor: "#42a5f5",
          dragBgColor: '#42a5f5',
        },
        {
          id: "MAD",
          name: "MAD",
          bgColor: "#ab47bc",
          borderColor: "#ab47bc",
          dragBgColor: '#ab47bc',
        },
        {
          id: "ITD",
          name: "ITD",
          bgColor: "#ff7043",
          borderColor: "#ff7043",
          dragBgColor: '#ff7043',
        },
        {
          id: "SSD",
          name: "SSD",
          bgColor: "#26a69a",
          borderColor: "#26a69a",
          dragBgColor: '#26a69a',
        },
        {
          id: "RD",
          name: "RD",
          bgColor: "#5c6bc0",
          borderColor: "#5c6bc0",
          dragBgColor: '#5c6bc0',
        },
        {
          id: "IDAM",
          name: "IDAM",
          bgColor: "#ec407a",
          borderColor: "#ec407a",
          dragBgColor: '#ec407a',
        },
      ]}
      taskView={false}
      disableDblClick={true}
      disableClick={false}
      isReadOnly={false}
      month={{
        startDayOfWeek: 0,
      }}
      schedules={inputs.schedule}
      timezones={[
        {
          timezoneOffset: 540,
          displayLabel: "GMT+09:00",
          tooltip: "Seoul",
        },
      ]}
      useDetailPopup={true}
      useCreationPopup={true}
      week={{
        showTimezoneCollapseButton: true,
        timezonesCollapsed: true,
        hourEnd:20,
        narrowWeekend: true
      }}
      onAfterRenderSchedule={scrollDown}
      onBeforeCreateSchedule={createSchedules}
      onBeforeUpdateSchedule={updateSchedule}
      onBeforeDeleteSchedule={deleteSchedule}
    />
  );

  const DatePickerComponent = (props) => {

    // State 생성
    const [date, setDate] = useState({
      selectedDate: new Date()
    });

    const onChangeDatePicker = (date) => {
      setDate({...date, selectedDate: date});
    }

    return <DatePicker
      id="returnDate"
      locale={ko}	// 언어설정 기본값은 영어
      dateFormat="yyyy-MM-dd"	// 날짜 형식 설정
      className="input-datepicker p5 input W_190"	// 클래스 명 지정 css주기 위해
      maxDate={new Date()}	// 선택할 수 있는 최소 날짜값 지정 
      closeOnScroll={true}	// 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
      placeholderText="날짜 선택"	// placeholder
      selected={date.selectedDate}
      onChange={(date) => onChangeDatePicker(date)}	// 날짜를 선택하였을 때 실행될 함수
    />
  }

  return (
    <div>
      {/* 레이어 팝업 */}
      <div id="dim" className="dim none" >
        <div id="savePopup" className="save-popup none">
          {/* 닫기 */}
          <div><IoIosClose size="24" className="mr10 float-right pointer" color="#555" onClick={popupClose}/></div>
          {/* 날짜 */}
          <div className="m20 flex">
            <IoIosCalendar size="24" className="mr10" color="#555"/>
            <DatePickerComponent />
          </div>
          {/* 이름 */}
          <div className="m20 flex">
            <IoIosPerson size="24" className="mr10" color="#555"/>
            <input id="name" type="text" className="p5 input W_190"  placeholder="이름"/>
          </div>
          {/* 주차장, 구역 */}
          <div className="m20 flex">
            <IoMdCar size="24" className="mr10" color="#555"/>
            <select className="select-purpose p5 input mr10" id="locationFloor">
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="B3">B3</option>
            </select>
            <input id="locationArea" type="text" className="p5 input W_190"  placeholder="구역"/>
          </div>
          {/* 주행거리 */}
          <div className="mr20 ml20 mt20 mb10 flex">
            <CgRuler size="24" className="mr10" color="#555"/>
            <input id="before" type="text" className="p5 mr10 input W_190" onInput={onlyNumber} onBlur={autoCalculate} placeholder="이전 주행거리"/>
            <input id="after" type="text" className="p5 mr10 input W_190" onInput={onlyNumber} onBlur={autoCalculate} placeholder="주행 후" />
            <input id="calculated" type="text" className="p5 mr10 input W_100 input-bg-grey" placeholder="자동 계산" readOnly />
            {/* <button className="btn-calculation"><CgRuler size="12" className="mr10" color="#555"/>자동계산</button> */}
          </div>
          <div className="ml20 mr20 f_13 color-grey">※ 주행 전 거리가 다른 경우 수정해 주시고, 주행 후 거리는 계기판의 총 주행거리를 입력해 주세요.</div>
          {/* 실제 주행거리 */}
          <div className="mr20 ml20 mt20 mb10 flex">
            <CgRuler size="24" className="mr10" color="#555"/>
            <input id="realDistance" type="text" className="p5 input W_190" onInput={onlyNumberAndComma} placeholder="실제 주행거리"/>
          </div>
          <div className="ml20 mr20 f_13 color-grey">※ 주행거리 초기화 셋팅 후, 사용한 경우에는 실제 주행 거리도 소수점까지 입력해 주세요.</div>
          {/* 용도 */}
          <div className="m20 flex"><BsFilterLeft size="24" className="mr10" color="#555"/>
            <select id="type" className="select-purpose p5 input" id="type">
              <option value="0">일반 업무용</option>
              <option value="1">출퇴근 사용</option>
              <option value="2">개인 사용</option>
            </select>
          </div>
          {/* 비고 */}
          <div className="mr20 ml20 mt20 mb10 flex"><IoReader size="24" className="mr10" color="#555"/><input id="notes" type="text" className="p5 input W_190"  placeholder="비고"/></div>
          <div className="ml20 mr20 f_13 color-grey">※ 차량 정비, 소모품 교체 등의 내용이 있다면, 입력해 주세요.</div>
          {/* 저장 */}
          <div className="btn-save pointer" onClick={saveReturn}>저장</div>
          {/* HIDDEN */}
          <input type="hidden" id="departments" />
          <input type="hidden" id="reservationId" />
          <input type="hidden" id="purpose" />
          <input type="hidden" id="start" />
          <input type="hidden" id="end" />
          <input type="hidden" id="destinationArea" />
          <input type="hidden" id="isAllDay" />
          <input type="hidden" id="isUpdate" value="0"/>
        </div>

        <div id="detailPopup" className="detail-popup none">
          {/* 닫기 */}
          <div><IoIosClose size="24" className="mr10 float-right pointer" color="#555" onClick={popupClose}/></div>
          {/* 날짜 */}
          <div className="ml20 mt40 mr20 mb30 flex">
            <div className="color-SSD ractangle-24 mr20"></div>
            <span className="line-height-24"><span id="detailPurpose">삼성전자 회의참석</span>
              <div className="f_14" id="detailDate">4월 9일 수요일 - 4월 10일 목요일 / 반납 4월 10일</div>
            </span>
          </div>
          {/* 위치 */}
          <div className="ml20 mt20 mr20 mb40 flex">
            <IoLocationSharp size="24" className="mr20" color="#555"/>
            <span className="line-height-24" id="detailDestinationArea"></span>
          </div>
          {/* 사용자 */}
          <div className="ml20 mt20 mr20 mb40 flex">
            <IoIosPerson size="24" className="mr20" color="#555"/>
            <span className="line-height-24" id="detailName"></span>
          </div>
          {/* 주차 */}
          <div className="ml20 mt20 mr20 mb40 flex">
            <IoMdCar size="24" className="mr20" color="#555"/>
            <span className="line-height-24" id="detailLocation"></span>
          </div>
          {/* 주행 */}
          <div className="ml20 mt20 mr20 mb40 flex">
            <CgRuler size="24" className="mr20" color="#555"/>
            <span className="line-height-24" id="detailDistance"></span><span className="line-height-24"> km</span>
          </div>
          {/* 용도 및 비고 */}
          <div className="ml20 mt20 mr20 mb20 flex">
            <IoReader size="24" className="mr20" color="#555"/>
            <span className="line-height-24" id="detailNotes"></span>
          </div>
          {/* 저장 */}
          <div className="btn-save pointer" onClick={modifyPopup}>수정</div>
        </div>
      </div>
      {/* 레이어 팝업 */}


      <Header openCreationPopup={openCreationPopup}/>
      <div>
        <SideBar today={inputs.today} onChangeDate={changeToday} refresh={inputs.refresh}/>
        <div className="mainComponent">
          <div className="weekNavigator">
            <div className="text-center weekNavigator-month">
              <span className="weekNavigatorText">{inputs.today.getFullYear()}년 {inputs.today.getMonth()+1}월</span>
              <img src="images/btn_nextweek@3x.png" className="btn-nextWeek pointer" onClick={goNextWeek}  />
              <img src="images/btn_preweek@3x.png" className="btn-prevWeek pointer" onClick={goPrevWeek} />
              <img src="images/btn_today@3x.png" className="btn-today pointer" onClick={goToday} />
            </div>
          </div>
          <MyComponent></MyComponent>
        </div>
      </div>
      {loading()}
      <Hidden />
    </div>
  );
} 