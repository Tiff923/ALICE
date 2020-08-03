import React from 'react';
import Taggy from './Taggy';

const NerDisplacy = (props) => {
  const { text, ents } = props.data;

  return (
    <div style={{ margin: '2em 1em' }}>
      <Taggy text={text} spans={ents} nerSearch={props.nerSearch} />
    </div>
  );
};

export default NerDisplacy;
