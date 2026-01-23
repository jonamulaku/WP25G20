import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ClientDashboardLayout from "./layouts/ClientDashboardLayout";
import TeamMemberDashboardLayout from "./layouts/TeamMemberDashboardLayout";

import Home from "./pages/Home";
import Team from "./pages/Team";
import News from "./pages/News";
import Projects from "./pages/Projects";
import InnerProjectPage from "./pages/Inner-Project-Page";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";

import DashboardOverview from "./pages/dashboard/DashboardOverview";
import UsersPage from "./pages/dashboard/UsersPage";
import ClientsPage from "./pages/dashboard/ClientsPage";
import CampaignsPage from "./pages/dashboard/CampaignsPage";
import PricingPage from "./pages/dashboard/PricingPage";
import TasksPage from "./pages/dashboard/TasksPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import TeamPage from "./pages/dashboard/TeamPage";
import InvoicesPage from "./pages/dashboard/InvoicesPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

import ClientDashboard from "./pages/client-dashboard/ClientDashboard";
import MyCampaigns from "./pages/client-dashboard/MyCampaigns";
import ReportsAnalytics from "./pages/client-dashboard/ReportsAnalytics";
import Approvals from "./pages/client-dashboard/Approvals";
import FilesAssets from "./pages/client-dashboard/FilesAssets";
import Messages from "./pages/client-dashboard/Messages";
import BillingInvoices from "./pages/client-dashboard/BillingInvoices";
import AccountSettings from "./pages/client-dashboard/AccountSettings";

import TeamDashboard from "./pages/team-dashboard/Dashboard";
import MyTasks from "./pages/team-dashboard/MyTasks";
import TeamCampaigns from "./pages/team-dashboard/Campaigns";
import Performance from "./pages/team-dashboard/Performance";
import TeamCalendar from "./pages/team-dashboard/Calendar";
import Communication from "./pages/team-dashboard/Communication";
import ActivityTime from "./pages/team-dashboard/ActivityTime";
import ProfileSettings from "./pages/team-dashboard/ProfileSettings";

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

            <Route
                path="/contact"
                element={<Contact />}
            />

            {/* Admin Dashboard Routes */}
            <Route
                path="/dashboard"
                element={<DashboardLayout />}
            >
                <Route index element={<DashboardOverview />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Client Dashboard Routes */}
            <Route
                path="/client-dashboard"
                element={<ClientDashboardLayout />}
            >
                <Route index element={<ClientDashboard />} />
                <Route path="campaigns" element={<MyCampaigns />} />
                <Route path="reports" element={<ReportsAnalytics />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="files" element={<FilesAssets />} />
                <Route path="messages" element={<Messages />} />
                <Route path="billing" element={<BillingInvoices />} />
                <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* Team Member Dashboard Routes */}
            <Route
                path="/team-dashboard"
                element={<TeamMemberDashboardLayout />}
            >
                <Route index element={<TeamDashboard />} />
                <Route path="tasks" element={<MyTasks />} />
                <Route path="campaigns" element={<TeamCampaigns />} />
                <Route path="performance" element={<Performance />} />
                <Route path="calendar" element={<TeamCalendar />} />
                <Route path="communication" element={<Communication />} />
                <Route path="activity" element={<ActivityTime />} />
                <Route path="profile" element={<ProfileSettings />} />
            </Route>

        </Routes>
    );
}
