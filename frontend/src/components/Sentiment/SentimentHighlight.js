import React from 'react';
import { sentimentcolors } from '../../utils/colors';

const SentimentHighlight = (props) => {
  const { sentence, entity, sentiment } = props;
  const len = entity.length;

  //   const calculateIndices = () => {
  //     var startIndex = 0;
  //     var index = 0;
  //     var res = [];
  //     while ((index = sentence.indexOf(entity, startIndex)) > -1) {
  //       res.push(index);
  //       startIndex = startIndex + index;
  //     }
  //     return res;
  //   };

  const color = sentimentcolors[sentiment];
  const index = sentence.indexOf(entity);
  return (
    <p>
      <span>{sentence.slice(0, index)}</span>
      <span style={{ backgroundColor: color }}>
        {sentence.slice(index, index + len)}
      </span>
      <span>{sentence.slice(index + len)}</span>
    </p>
  );
  //   const indices = calculateIndices();
  //   console.log(indices);

  //   return indices.length === 1 ? (
  //     <p>
  //       <span>{sentence.slice(0, indices[0])}</span>
  //       <span style={{ backgroundColor: color }}>
  //         {sentence.slice(indices[0], indices[0] + len)}
  //       </span>
  //       <span>{sentence.slice(indices[0] + len)}</span>
  //     </p>
  //   ) : (
  //     <p>
  //       <span>{sentence.slice(0, indices[0])}</span>
  //       {indices.slice(0, indices.length - 1).forEach((e, i) => (
  //         <>
  //           <span style={{ backgroundColor: color }}>
  //             {sentence.slice(e, e + len)}
  //           </span>
  //           <span>{sentence.slice(i, indices[i + 1])}</span>
  //         </>
  //       ))}
  //       <span style={{ backgroundColor: color }}>
  //         {sentence.slice(
  //           indices[indices.length - 1],
  //           indices[indices.length - 1] + len
  //         )}
  //       </span>
  //       <span>{sentence.slice(indices[indices.length - 1] + len)}</span>
  //     </p>
  //   );
};

export default SentimentHighlight;
