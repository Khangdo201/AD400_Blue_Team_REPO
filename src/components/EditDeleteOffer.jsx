import { useState } from "react";

export default function EditDeleteOffer() {
  // Temporary data for testing ABTS-12
  const [offers, setOffers] = useState([
    { id: 1, company: "Google", title: "Software Engineer" },
    { id: 2, company: "Amazon", title: "Software Developer" }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  // Select an existing offer to edit
  function handleEdit(offer) {
    setEditingId(offer.id);
    setCompany(offer.company);
    setTitle(offer.title);
  }

  // Save changes to the selected offer
  function handleSave(id) {
    if (!company.trim() || !title.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setOffers(offers.map((offer) =>
      offer.id === id
        ? { ...offer, company: company.trim(), title: title.trim() }
        : offer
    ));

    setEditingId(null);
  }

  // Confirm before deleting an offer
  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this job offer?")) {
      setOffers(offers.filter((offer) => offer.id !== id));
      if (editingId === id) setEditingId(null);
    }
  }

  return (
    <div>
      <h2>CareerCompare - Job Offers</h2>

      {offers.map((offer) => (
        <div key={offer.id}>
          {editingId === offer.id ? (
            <div>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job Title"
              />
              <button onClick={() => handleSave(offer.id)}>
                Save
              </button>
              <button onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p>{offer.company} - {offer.title}</p>
              <button onClick={() => handleEdit(offer)}>
                Edit
              </button>
              <button onClick={() => handleDelete(offer.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}