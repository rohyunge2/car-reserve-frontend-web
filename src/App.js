import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import CalendarComp from "./components/meeting/calendarComp"
import {isIE, isMobile} from 'react-device-detect';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (isIE) 
      return(
      <div className="loading"> IE is not supported. Download Chrome/Firefox/Microsoft Edge </div>
    ) 

    if (isMobile) {
      window.location.href = "https://m-car.k8s.bns.co.kr";
      return null;
    }

    return (
      <BrowserRouter>
        {/* <Link to="/car/reservation">회의실 예약</Link> */}
        <Switch>
          <Route exact path="/meeting/reservation" component={CalendarComp}></Route>
          <Route exact path="/" component={CalendarComp}></Route>
          {/* <Route exact path="/intro" component={Intro}></Route> */}
          <Route exact path="/car/reservation" component={() => {
            window.location.href = "http://localhost:3000/";
            return null;
          }}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
