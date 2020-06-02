import React from 'react';
import { nercolors } from '../../utils/colors';

const Taggy = (props) => {
  const { spans, text, nerSearch } = props;
  // Initialize an empty array that will hold the text and entities
  let jsx = [];

  // Initialize an empty array. The contents of 'elements' will eventually get pushed to the 'jsx' array, and will be converted to jsx markup in the process.
  let elements = [];
  // Keep track of location in the string of text
  let offset = 0;
  // Loop through the spans, using the span data to construct the 'elements' array
  spans.forEach(({ type, start, end }) => {
    // Create a string of text that does not contain any entities
    const fragment = text.slice(offset, start);
    // Create an entity
    const entity = text.slice(start, end);
    // Push the both of them to the elements array
    elements.push(fragment);
    elements.push({
      token: entity,
      type: type,
    });
    // Update our position within the string of text
    offset = end;
  });
  // After pushing all of the entities to the 'elements' array, push the remaining text to the 'elements' array. Elements should now consist of strings and objects/entities.
  elements.push(text.slice(offset, text.length));
  // Filter out unnecessary spaces
  elements = elements.filter((val) => val !== ' ');
  // Loop through elements array looking for multi-word entities.
  for (let e = 0; e < elements.length; e++) {
    // Check if we've stopped at an entity
    if (elements[e].token) {
      // Examine the consecutive entities, if any.
      for (let i = e + 1; i < elements.length; i++) {
        // Combine consecutive entities of the same type into one entity. Then, mark the duplicates as 'false'.
        if (
          typeof elements[i] !== 'string' &&
          elements[i].type === elements[e].type
        ) {
          elements[e].token += ' ' + elements[i].token;
          elements[i] = false;
        }
        // Stop the loop when we've run out of consecutive entities
        if (typeof elements[i] === 'string') {
          break;
        }
      }
    }
  }
  // Filter out the consecutive entities that were marked as duplicates
  elements = elements.filter((val) => !!val);
  // Loop through our 'elements' array. Push strings directly to the 'jsx' array. Convert entity objects to jsx markup, then push to the 'jsx' array.}
  elements.forEach((t) => {
    if (typeof t === 'string') {
      jsx.push(t);
    } else {
      var category = t.type;
      var token = t.token;
      jsx.push(
        <mark
          style={{
            padding: '0.25em 0.35em',
            margin: '2px 0.25em',
            lineHeight: '1',
            display: 'inline-block',
            borderRadius: '0.25em',
            border: '1px solid',
            background:
              nerSearch.size === 0
                ? `${nercolors[category]}90`
                : nerSearch.has(token)
                ? 'yellow'
                : 'grey',
            borderColor:
              nerSearch.size === 0
                ? `${nercolors[category]}`
                : nerSearch.has(token)
                ? 'yellow'
                : 'grey',
            id: token,
          }}
        >
          {token}
          <span
            style={{
              boxSizing: 'border-box',
              fontSize: '0.6em',
              lineHeight: '1',
              padding: '0.35em',
              borderRadius: '0.35em',
              textTransform: 'uppercase',
              display: 'inline-block',
              verticalAlign: 'middle',
              margin: '0px 0px 0.1rem 0.5rem',
              background:
                nerSearch.size === 0
                  ? `${nercolors[category]}`
                  : nerSearch.has(token)
                  ? 'yellow'
                  : 'grey',
            }}
          >
            {category}
          </span>
        </mark>
      );
    }
  });

  // Return the markup
  return (
    <div
      style={{
        backgroundColor: nerSearch.size === 0 ? null : 'rgb(0,0,0,0.5)',
      }}
    >
      {jsx.map((j, i) => {
        try {
          return (
            <span key={i} id={j.props.children[0]}>
              {j}
            </span>
          );
        } catch (err) {
          return <span key={i}>{j}</span>;
        }
      })}
    </div>
  );
};

export default Taggy;
