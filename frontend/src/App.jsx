import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import useScrollAnimation from "./useScrollAnimation";
import WorkerApplication from "./pages/WorkerApplication";
import AgentRegistration from "./pages/AgentRegistration";

import ApplyForJobs from "./pages/ApplyForJobs";

import ImageUpload from "./pages/ImageUpload";
import ContactUs from "./pages/ContactUs";
import Service from "./pages/Service";
import Project from "./pages/Project";
import QuoteForm from "./pages/QuoteForm";
import Sustainability from "./pages/Sustainability";
import CareersPage from "./pages/Career";
// import ProjectPreview from "./components/home_components/OurStrategies";
import SustainabilityEditor from "./components/editor_components/SustainabilityEditor";
import CareerEditor from "./components/editor_components/CareerEditor";
import JobApplications from "./components/admin_components/JobApplications";
import NewsEvents from "./pages/NewsEvents";
import OurClients from "./pages/OurClients";
import OurClientsEditor from "./components/editor_components/OurClientsEditor";
import NewsAndEventsEditor from "./components/editor_components/NewsAndEventsEditor";
import { IntlProvider } from "react-intl";
import Concern from "./components/home_components/Concern";
import OurConcernEditor from "./components/editor_components/OurConcernEditor";
import BrandPage from "./components/band/BrandPage";

// Lazy-loaded pages
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Services = React.lazy(() => import("./pages/Services"));
const Login = React.lazy(() => import("./components/Login"));

// Lazy-loaded admin pages
const HomeEditor = React.lazy(() =>
  import("./components/editor_components/HomeEditor")
);
const AboutEditor = React.lazy(() =>
  import("./components/editor_components/AboutEditor")
);
const ContactEditor = React.lazy(() =>
  import("./components/editor_components/ContactEditor")
);
const GalleryEditor = React.lazy(() =>
  import("./components/editor_components/GalleryEditor")
);
const ProjectsEditor = React.lazy(() =>
  import("./components/editor_components/ProjectsEditor")
);
const LayoutsEditor = React.lazy(() =>
  import("./components/editor_components/LayoutsEditor")
);
const ServicesEditor = React.lazy(() =>
  import("./components/editor_components/ServicesEditor")
);
const CreateAdmin = React.lazy(() => import("./components/CreateAdmin"));
const MessagesList = React.lazy(() =>
  import("./components/admin_components/MessagesList")
);

const App = () => {
  useScrollAnimation();

  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "home",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "about",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <About />
            </Suspense>
          ),
        },
        {
          path: "our-concern",
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Concern />
                </Suspense>
              ),
            },
            {
              path: ":slug",
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <BrandPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "sustainability",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Sustainability></Sustainability>
            </Suspense>
          ),
        },

        {
          path: "newsevents",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <NewsEvents></NewsEvents>
            </Suspense>
          ),
        },
        {
          path: "clients",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <OurClients></OurClients>
            </Suspense>
          ),
        },
        {
          path: "career",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <CareersPage></CareersPage>
            </Suspense>
          ),
        },

        {
          path: "service",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Service></Service>
            </Suspense>
          ),
        },
        {
          path: "project",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Project></Project>
            </Suspense>
          ),
        },

        {
          path: "contact",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Contact />
            </Suspense>
          ),
        },
        {
          path: "gallery",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Gallery />
            </Suspense>
          ),
        },
        {
          path: "training",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Projects />
            </Suspense>
          ),
        },
        {
          path: "quote",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <QuoteForm></QuoteForm>
            </Suspense>
          ),
        },
        {
          path: "services",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Services />
            </Suspense>
          ),
          children: [
            {
              path: ":serviceSlug", // Dynamic route for individual services
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Services />
                </Suspense>
              ),
            },
          ],
        },
        // {
        //   path: "demand-submission",
        //   element: (
        //     <Suspense fallback={<div>Loading...</div>}>
        //       <DemandSubmission />
        //     </Suspense>
        //   ),
        // },
        // {
        //   path: "medical-report",
        //   element: (
        //     <Suspense fallback={<div>Loading...</div>}>
        //       <MedicalReport />
        //     </Suspense>
        //   ),
        // },
        {
          path: "contact-us",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ContactUs />
            </Suspense>
          ),
        },
        {
          path: "worker-registration",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <WorkerApplication />
            </Suspense>
          ),
        },
        {
          path: "apply-jobs-now",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ApplyForJobs />
            </Suspense>
          ),
        },
        {
          path: "agent-registration",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <AgentRegistration />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <PrivateRoute element={<AdminLayout />} />,
      children: [
        { path: "image-upload", element: <ImageUpload /> },
        {
          path: "",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <HomeEditor />
            </Suspense>
          ),
        },
        {
          path: "home",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <HomeEditor />
            </Suspense>
          ),
        },
        {
          path: "about",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <AboutEditor />
            </Suspense>
          ),
        },
        {
          path: "concern",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <OurConcernEditor />
            </Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ContactEditor />
            </Suspense>
          ),
        },

        {
          path: "gallery",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <GalleryEditor />
            </Suspense>
          ),
        },
        {
          path: "projects",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ProjectsEditor />
            </Suspense>
          ),
        },
        {
          path: "sustainability",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <SustainabilityEditor></SustainabilityEditor>
            </Suspense>
          ),
        },
        {
          path: "career",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <CareerEditor></CareerEditor>
            </Suspense>
          ),
        },
        {
          path: "our-clients",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <OurClientsEditor></OurClientsEditor>
            </Suspense>
          ),
        },

        {
          path: "news-event-recruitment",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <NewsAndEventsEditor></NewsAndEventsEditor>
            </Suspense>
          ),
        },

        {
          path: "layouts",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <LayoutsEditor />
            </Suspense>
          ),
        },
        {
          path: "services",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ServicesEditor></ServicesEditor>
            </Suspense>
          ),
        },
        // {
        //   path: "services",
        //   element: (
        //     <Suspense fallback={<div>Loading...</div>}>
        //       <ServicesEditor />
        //     </Suspense>
        //   ),
        //   children: [
        //     {
        //       path: ":serviceSlug",  // Dynamic route for editing individual services
        //       element: (
        //         <Suspense fallback={<div>Loading...</div>}>
        //           <ServicesEditor />
        //         </Suspense>
        //       ),
        //     },
        //   ],
        // },
        {
          path: "create-admin",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <CreateAdmin />
            </Suspense>
          ),
        },
        {
          path: "contact-messages",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <MessagesList />
            </Suspense>
          ),
        },
        {
          path: "job-applications",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <JobApplications />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default () => (
  <AuthProvider>
    <IntlProvider locale="en">
      <App />
    </IntlProvider>
  </AuthProvider>
);
