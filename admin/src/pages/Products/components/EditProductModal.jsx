import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProductModal = ({ show, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    images: null
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        countInStock: product.countInStock || '',
        images: null
      });
      if (product.images && product.images.length > 0) {
        setPreviewImages(product.images.map(img => `${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${img}`));
      } else {
        setPreviewImages([]);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images' && files) {
      setFormData(prev => ({ ...prev, images: files }));
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        previews.push(URL.createObjectURL(files[i]));
      }
      setPreviewImages(previews);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(product._id, formData);
    setLoading(false);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      countInStock: '',
      images: null
    });
    setPreviewImages([]);
    onClose();
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="border-0" style={{ background: 'linear-gradient(135deg, #041E42 0%, #0B1120 100%)' }}>
        <Modal.Title className="fw-bold text-white">
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>edit</span>
          Edit Product
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <div className="row g-3">
            <div className="col-12">
              <Form.Label className="fw-semibold small text-primary">Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="rounded-4 border-2"
                required
              />
            </div>
            <div className="col-12">
              <Form.Label className="fw-semibold small text-primary">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="rounded-4 border-2"
                required
              />
            </div>
            <div className="col-6">
              <Form.Label className="fw-semibold small text-primary">Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="rounded-4 border-2"
                required
              />
            </div>
            <div className="col-6">
              <Form.Label className="fw-semibold small text-primary">Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-4 border-2"
                required
              >
                <option value="">Select Category</option>
                <option value="Shoes">👟 Shoes</option>
                <option value="Clothing">👕 Clothing</option>
                <option value="Accessories">🎒 Accessories</option>
              </Form.Select>
            </div>
            <div className="col-6">
              <Form.Label className="fw-semibold small text-primary">Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                placeholder="0"
                className="rounded-4 border-2"
                required
              />
            </div>
            <div className="col-6">
              <Form.Label className="fw-semibold small text-primary">Update Images</Form.Label>
              <Form.Control
                type="file"
                name="images"
                onChange={handleChange}
                multiple
                accept="image/*"
                className="rounded-4 border-2"
              />
              <small className="text-secondary">Leave empty to keep existing images</small>
            </div>
            {previewImages.length > 0 && (
              <div className="col-12">
                <Form.Label className="fw-semibold small text-primary">Current Images</Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {previewImages.map((src, index) => (
                    <div key={index} className="rounded-3 overflow-hidden border" style={{ width: '80px', height: '80px' }}>
                      <img src={src} alt={`Preview ${index}`} className="w-100 h-100 object-fit-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4">
          <Button variant="light" onClick={handleClose} className="rounded-5 px-4">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="rounded-5 px-4 d-flex align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                Update Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProductModal;