import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import CreateListing from "./components/CreateListing";

import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import FrontPage from "./pages/FrontPage";
import Login from "./components/Login";

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  function openCreateModal() {
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    setShowCreateModal(false);
  }

  return (
    <BrowserRouter>

      {/* Navbar skal kunne åbne modal */}
      <Navbar openModal={openCreateModal} />

      {/* Modal der viser create listing */}
      <CreateListing
        open={showCreateModal} 
        onClose={closeCreateModal} 
      />

      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
