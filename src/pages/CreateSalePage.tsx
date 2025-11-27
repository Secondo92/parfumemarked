import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { uploadListingImages, createListing } from "../services/listingsService";
import { useNavigate } from "react-router-dom";
import type { ListingType } from "../types";

const CreateSalePage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<ListingType>("fullBottle");
  const [files, setFiles] = useState<File[]>([]);
  const appId = "duftbasen-default-app";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    let imgUrls: string[] = [];
    if (files.length > 0) {
      imgUrls = await uploadListingImages(appId, user.uid, files);
    }

    await createListing(appId, {
      title,
      description: desc,
      price: Number(price),
      type,
      sellerId: user.uid,
      sellerName: profile.username,
      images: imgUrls,
    });

    navigate("/");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Opret annonce</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" placeholder="Titel"
          value={title} onChange={(e) => setTitle(e.target.value)} />

        <textarea className="input" placeholder="Beskrivelse"
          value={desc} onChange={(e) => setDesc(e.target.value)} />

        <input className="input" placeholder="Pris"
          value={price} onChange={(e) => setPrice(e.target.value)} type="number" />

        <select className="input" value={type} onChange={(e) => setType(e.target.value as ListingType)}>
          <option value="fullBottle">Flaske</option>
          <option value="decant">Decant</option>
          <option value="split">Split</option>
        </select>

        <input type="file" multiple onChange={(e) => {
          if (e.target.files) setFiles(Array.from(e.target.files));
        }} />

        <button className="dark-button px-4 py-2 rounded-lg">Opret annonce</button>
      </form>
    </div>
  );
};

export default CreateSalePage;
