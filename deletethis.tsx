import React, { useMemo } from 'react';

const ExpensiveComponent = ({ num }) => {
  const memoizedValue = useMemo(() => num * 2, [num]);

  return <div>{memoizedValue}</div>;
};

export default ExpensiveComponent;
