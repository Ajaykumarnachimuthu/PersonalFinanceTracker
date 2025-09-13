import React from 'react';

function Categories({ categories, onCategoryClick, onAddCategory, onDeleteCategory }) {
  const toId = (cat) => {
    return cat.replaceAll("\\W+", "_");
  };

  return (
    <div className="row g-3">
      {categories.map((category) => (
        <div key={category._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div 
            className="cat-tile"
            style={{ 
              background: `radial-gradient(200px 120px at 50% -10%, rgba(255,255,255,.15), transparent 60%), ${category.color}` 
            }}
            onClick={() => onCategoryClick(category)}
          >
            {category.name}
            <button 
              className="cat-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category._id);
              }}
            >
              🗑
            </button>
          </div>
        </div>
      ))}

      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <button className="add-cat-btn h-100" onClick={onAddCategory}>
          + Add Category
        </button>
      </div>
    </div>
  );
}

export default Categories;