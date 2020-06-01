import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './visualcardstyles.css';

const VisualCard = (props) => {
  return (
    <div className="card" id={props.id} style={props.style}>
      <Row>
        <Col xs={9}>
          <div className="header">
            <h4 className="title">{props.title}</h4>
            <p className="category">{props.category}</p>
          </div>
        </Col>
        <Col xs={3}>{props.summary}</Col>
      </Row>
      <div className="content">
        {props.content}
        <div className="footer">{props.legend}</div>
      </div>
    </div>
  );
};

export default VisualCard;
