import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Divider from '@material-ui/core/Divider';
import './statscardstyles.css';

const StatsCard = (props) => {
  return (
    <div className="stats-card">
      <div className="card-content">
        <Row>
          <Col xs={5}>
            <div className="stats-icon">{props.bigIcon}</div>
          </Col>
          <Col xs={7}>
            <div className="stats">
              <p>{props.statsText}</p>
              {props.statsValue}
            </div>
          </Col>
        </Row>
        <Divider />
        <div className="card-subcontent">Subcontent:</div>
      </div>
    </div>
  );
};

export default StatsCard;
