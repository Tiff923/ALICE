import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './visualcardstyles.css';

const VisualCard = (props) => {
  return (
    <div className="viscard" id={props.id} style={props.style}>
      <Row>
        <Col xs={9}>
          <div className="viscard-header">
            <h4 className="viscard-title">{props.title}</h4>
            <p className="viscard-category">{props.category}</p>
          </div>
        </Col>
        <Col xs={3}>{props.summary}</Col>
      </Row>
      <div className="viscard-content">
        {props.content}
        {/* <div className="card-footer">{props.legend}</div> */}
      </div>
    </div>
  );
};

export default VisualCard;
