const ProductTable = ({ products, onDelete, onEdit, onRefresh }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Image</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Product Details</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold">Category</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold text-end">Pricing</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold text-center">Stock</th>
              <th className="px-4 py-3 small text-uppercase text-secondary fw-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="table-row-enter">
                  <td className="px-4 py-3">
                    <div className="bg-light rounded-3 overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${product.images[0]}`}
                          alt={product.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-secondary">image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="fw-bold text-primary mb-0">{product.name}</p>
                      <p className="small text-secondary mb-0">SKU: SP-{String(product._id).slice(-6)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge bg-light text-dark rounded-5 px-3 py-2 small fw-bold text-uppercase">{product.category}</span>
                  </td>
                  <td className="px-4 py-3 text-end fw-bold text-primary">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`fw-bold ${product.countInStock === 0 ? 'text-danger' : 'text-success'}`}>
                      {product.countInStock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-light btn-sm rounded-circle p-2 hover-primary"
                        title="Edit"
                        onClick={() => onEdit(product)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button
                        className="btn btn-light btn-sm rounded-circle p-2 text-danger hover-danger"
                        title="Delete"
                        onClick={() => onDelete(product._id)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>inventory_2</span>
                  <p className="mt-2">No products found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;