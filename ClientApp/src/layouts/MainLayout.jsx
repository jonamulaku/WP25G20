import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout({ children }) {
    return (
        <>
            <ScrollToTop />
            <NavBar />
            {children}
            <Footer />
        </>
    );
}
