import CalendarSelector from 'react-calendar';
import React, { useState, useEffect } from 'react'
import axios from "axios";
import * as config from '../../config';
import 'react-calendar/dist/Calendar.css';

export default function SideBar(props) {

  const [inputs, setInputs] = useState({
    currentLocation: <div></div>,
  });

  // 최초 세팅
  useEffect(() => {
    currentLocation();
  }, [props.refresh]);

  const changeDate = (date) => {
    props.onChangeDate(date);
  }

  const onPopup = () => {
    window.open('intro', 'meetingReservationIntro', 'width=520px, height=400px')
  }

  const currentLocation = () => {
    axios
    .get(config.API_URL + "/api/car-return/last")
    .then((response) => {
      const data = response.data[0];
      if ( response.data.length > 0){
        setInputs({
          ...inputs, 
          currentLocation: <div>{data.location_floor} / {data.location_area}</div>
        })
      } else {
        setInputs({
          ...inputs, 
          currentLocation: <div>없음</div>
        })
      }

    })
  }

  return (
    <div className="sidebar">
        <CalendarSelector
          className="mb30 no-border"
          onChange={changeDate}
          value={props.today}
          calendarType="US"
          locale="en-US"
        />
        <div className="ml20">부서별 예약현황</div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 mt5 float-left rectangle color-MD"></div>
          <span>MD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 mt5 float-left rectangle color-MAD"></div>
          <span>MAD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 mt5 float-left rectangle color-ITD"></div>
          <span>ITD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 mt5 float-left rectangle color-SSD"></div>
          <span>SSD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 mt5 float-left rectangle color-RD"></div>
          <span>RD</span>
        </div>
        <div className="mt10 mb10">
          <div className="ml20 mr10 mt5 float-left rectangle color-IDAM"></div>
          <span>IDAM</span>
        </div>
        <div className="currentLocation p10">
          <div className="currentLocation-title">마지막 반납 위치</div>
          <div className="currentLocation-value">{inputs.currentLocation}</div>
        </div>
    </div>
  );
}
  