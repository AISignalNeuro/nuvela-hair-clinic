import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UIProvider } from "../context/UIContext.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { detectLanguage } from "../i18n/config.js";
import LocaleLayout from "./LocaleLayout.jsx";
import HomePage from "../pages/HomePage/index.jsx";

// Home is eager (first paint); every other page is code-split.
const ServicesPage = lazy(() => import("../pages/ServicesPage/index.jsx"));
const ServiceDetailPage = lazy(() => import("../pages/ServiceDetailPage/index.jsx"));
const PackagesPage = lazy(() => import("../pages/PackagesPage/index.jsx"));
const GalleryPage = lazy(() => import("../pages/GalleryPage/index.jsx"));
const BlogListPage = lazy(() => import("../pages/BlogListPage/index.jsx"));
const BlogDetailPage = lazy(() => import("../pages/BlogDetailPage/index.jsx"));
const AboutPage = lazy(() => import("../pages/AboutPage/index.jsx"));
const FaqPage = lazy(() => import("../pages/FaqPage/index.jsx"));
const ContactPage = lazy(() => import("../pages/ContactPage/index.jsx"));
const BookingPage = lazy(() => import("../pages/BookingPage/index.jsx"));
const AuthPage = lazy(() => import("../pages/AuthPage/index.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage/index.jsx"));
const LegalPage = lazy(() => import("../pages/LegalPage/index.jsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/index.jsx"));

// GitHub Pages serves the app from /<repo>/, so the router basename follows Vite's base.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <UIProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to={`/${detectLanguage()}`} replace />} />
            <Route path="/:lang" element={<LocaleLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/:slug" element={<ServiceDetailPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="privacy" element={<LegalPage doc="privacy" />} />
              <Route path="terms" element={<LegalPage doc="terms" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
