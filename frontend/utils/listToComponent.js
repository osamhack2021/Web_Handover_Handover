import React from 'react';

// expects list to be of form
export default function listToCompnent(Component, list, key) {
  return (
    list.map(elem => (
      <Component key={elem[key]} value={elem} />
    ))
  );
}
