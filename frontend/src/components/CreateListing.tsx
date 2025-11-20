import { useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function CreateListing({ open, onClose }: ModalProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("");

  if (!open) return null;

  function submitForm() {
    console.log({
      title,
      description,
      amount,
      price,
      type
    });

    onClose();
  }

  return (
    <div 
      className="modal fade show"
      style={{ 
        display: "block",
        background: "rgba(0,0,0,0.5)"
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Create Listing</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label className="col-form-label">Title</label>
              <input 
                type="text" 
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="col-form-label">Description</label>
              <textarea 
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="col-form-label">Amount</label>
              <input 
                type="number" 
                className="form-control"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="col-form-label">Price</label>
              <input 
                type="number" 
                className="form-control"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="col-form-label">Type</label>
              <select 
                className="form-control"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="">Choose type…</option>
                <option value="fullBottle">Full Bottle</option>
                <option value="decant">Decant</option>
                <option value="split">Split</option>
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={submitForm}>
              Save Listing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateListing;
