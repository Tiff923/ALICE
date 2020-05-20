import React from 'react';
import './visualcardstyles.css';

const VisualCard = (props) => {
  return (
    <div className="card">
      <div className="header">
        <h4 className="title">{props.title}</h4>
        <p className="category">{props.category}</p>
      </div>
      <div className="content">
        {props.content}
        <div className="footer">{props.legend}</div>
      </div>
    </div>
  );
};

export default VisualCard;
