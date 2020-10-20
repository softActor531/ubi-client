import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      404 - <Link to='/'>Go home</Link>
    </div>
  );
}

export default PageNotFound;
