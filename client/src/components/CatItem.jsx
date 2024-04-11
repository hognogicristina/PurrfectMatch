import React from 'react';

const CatItem = ({ cat }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>{cat.name}</h3>
      {cat.image && <img src={cat.image} alt={cat.name} style={{ maxWidth: '200px' }} />}
      {Object.entries(cat).map(([key, value]) => {
        if (key !== 'name' && key !== 'image') {
          return (
            <div key={key}>
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              : {value.toString()}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default CatItem;
