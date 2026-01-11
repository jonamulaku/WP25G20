import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Team from "./pages/Team";
import News from "./pages/News";
import Projects from "./pages/Projects";
import InnerProjectPage from "./pages/Inner-Project-Page";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

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
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<SignUp />}
            />

        </Routes>
    );
}
