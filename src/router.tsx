import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CreateSalePage from "./pages/CreateSalePage";
import ListingDetailPage from "./pages/ListingDetailPage";
import InboxPage from "./pages/InboxPage";
import ExternalProfilePage from "./pages/ExternalProfilePage";
import PageContainer from "./components/layout/PageContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageContainer />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />


      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-sale"
        element={
          <ProtectedRoute>
            <CreateSalePage />
          </ProtectedRoute>
        }
      />

      <Route path="/listing/:id" element={<ListingDetailPage />} />

      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />

      <Route path="/user/:userId" element={<ExternalProfilePage />} />
    </Route>
  )
);
