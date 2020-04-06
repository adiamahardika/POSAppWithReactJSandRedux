import React, { Component } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { chartOrder } from "../redux/actions/order";
import { Line } from "react-chartjs-2";
import moment from 'moment'
import Navbar from "../layout/Navbar";

class History extends Component {
  state = {
    start: new Date(),
    end: new Date()
  };

  onLogout(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    this.props.history.push('/login');
  }
  componentDidMount(){
      if(!localStorage.getItem('isAuth')){
          this.props.history.push('/login')
      }
  }
  onStart = event => this.setState({ start: event });
  onEnd = event => this.setState({ end: event });

  onSubmit = event => {
    event.preventDefault();
    const startDate = moment(this.state.start).format('MM-DD-YYYY');
    const endDate = moment(this.state.end).format('MM-DD-YYYY');
    this.props.dispatch(chartOrder(startDate, endDate));
  };

  render() {
    const { history } = this.props;
    let x = [];
    let y = [];
    let i = 0;
    history.forEach(item => {
      x[i] = item.date;
      y[i] = item.total;
      i++;
    });
    const data = {
      labels: x,
      datasets: [
        {
          label: "Transaction History",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: y
        }
      ]
    };

    return (
      <>
              <Navbar onLogout={this.onLogout.bind(this)}/>
        <div className='container'>
        <div className="row">
          <div className="col-md-10">
            <div className="col-md-12">
            </div>
            <div className="row">
              <div className="col-md-11">
                <div className="row" style={{marginTop: "10px"}}>
                  <div className="col-md-5">
                    <div>Start Date</div>
                    <Calendar
                      onChange={this.onStart}
                      value={this.state.start}
                    />
                  </div>
                  <div className="col-md-5">
                    <div> End Date</div>
                    <Calendar onChange={this.onEnd} value={this.state.end} />
                  </div>
                  <div className="col-md-2">
                    <Button onClick={this.onSubmit}>Submit</Button>
                  </div>
                </div>
                <div className="col-md-10" style={{marginTop:'20px'}}>
                  <Line data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    history: state.order.history
  };
};
export default connect(mapStateToProps)(History);