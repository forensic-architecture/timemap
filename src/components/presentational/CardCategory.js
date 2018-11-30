import React from 'react';

const CardCategory = ({ categoryTitle, categoryLabel, colorType }) => (
  <div className="event-card-section category">
    <h4>{categoryTitle}</h4>
    <p>
      <span className={`color-category ${colorType}`}/>
      {categoryLabel}
    </p>
  </div>
);

export default CardCategory;
