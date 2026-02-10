import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import DashboardTeaser from '../components/landing/DashboardTeaser';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';  
import FAQ from '../components/landing/FAQ';
import LeadCapture from '../components/landing/LeadCapture';
import Footer from '../components/landing/Footer';      


const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <DashboardTeaser />
      <Pricing />
      <Testimonials />
      {/* <Location /> */}
      <FAQ />
      <LeadCapture />
      <Footer />
    </div>
  );
};

export default Landing;