import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import SeatMap from '../components/landing/SeatMap';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';  
import FAQ from '../components/landing/FAQ';
import LeadCapture from '../components/landing/LeadCapture';
import Footer from '../components/landing/Footer';      
import LocationMap from '../components/landing/LocationMap';


const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <SeatMap />
      <Pricing />
      <LocationMap/>
      <Testimonials />
      {/* <Location /> */}
      <FAQ />
      <LeadCapture />
      <Footer />
    </div>
  );
};

export default Landing;