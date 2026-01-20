import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import Team from "./pages/Team";
import News from "./pages/News";
import Projects from "./pages/Projects";
import InnerProjectPage from "./pages/Inner-Project-Page";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ClientsPage from "./pages/dashboard/ClientsPage";
import CampaignsPage from "./pages/dashboard/CampaignsPage";
import TasksPage from "./pages/dashboard/TasksPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import TeamPage from "./pages/dashboard/TeamPage";
import InvoicesPage from "./pages/dashboard/InvoicesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

export default function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                }
            />

            <Route
                path="/team"
                element={
                    <MainLayout>
                        <Team />
                    </MainLayout>
                }
            />

            <Route
                path="/news"
                element={
                    <MainLayout>
                        <News />
                    </MainLayout>
                }
            />

            <Route
                path="/projects"
                element={
                    <MainLayout>
                        <Projects />
                    </MainLayout>
                }
            />

            <Route
                path="/projects/:slug"
                element={
                    <MainLayout>
                        <InnerProjectPage />
                    </MainLayout>
                }
            />

            <Route
                path="/about"
                element={
                    <MainLayout>
                        <AboutUs />
                    </MainLayout>
                }
            />

            <Route
                path="/services"
                element={
                    <MainLayout>
                        <Services />
                    </MainLayout>
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<SignUp />}
            />

            {/* Dashboard Routes */}
            <Route
                path="/dashboard"
                element={<DashboardLayout />}
            >
                <Route index element={<DashboardOverview />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

        </Routes>
    );
}
