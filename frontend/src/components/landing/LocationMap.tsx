import { MapPin, Phone, Clock } from "lucide-react";

const LocationMap = () => {
  // ✅ Shift Workspace Location (Mandaue, Cebu)
  const location = {
    name: "Shift Workspace",
    address: "2nd Floor Tec Fuel Bldg, H. Abellana St. Canduman, Mandaue City 6014, Ph",
    coordinates: {
      lat: 10.3334,
      lng: 123.9488
    },
    phone: "+(0927) 997 7497",
    hours: "Mon - Sat: 8:00 AM - 2:00 AM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=2nd+Floor+Tec+Fuel+Bldg,+H.+Abellana+St.+Canduman,+Mandaue+City,+Cebu"
  };

  const handleViewOnMaps = () => {
    window.open(location.googleMapsUrl, '_blank');
  };

  const normalizedPhoneHref = `tel:${location.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50" id="location">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ SECTION HEADER */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Visit Our <span className="text-orange-600">Workspace</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Located in the heart of Mandaue City, we're easy to find and accessible to all.
          </p>
        </div>

        {/* ✅ MAP CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT: Map Frame */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-full min-h-[400px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden group">
              
              {/* Google Maps Embed */}
              <iframe
                title="Shift Workspace Location"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.1234567890!2d${location.coordinates.lng}!3d${location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDE5JzU4LjIiTiAxMjPCsDU2JzU1LjciRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* RIGHT: Location Details */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            
            {/* Address Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 sm:p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Our Address</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {location.address}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200 mb-6" />

              {/* Contact Info */}
              <div className="space-y-4">
                
                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Phone</p>
                    <a href={normalizedPhoneHref} className="text-slate-900 font-semibold hover:text-orange-600 transition-colors">
                      {location.phone}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Hours</p>
                    <p className="text-slate-900 font-semibold">{location.hours}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
              <h3 className="text-2xl font-black mb-2">Ready to Visit?</h3>
              <p className="text-orange-100 mb-6">
                Drop by anytime during our operating hours. No appointment needed!
              </p>
              <button
                onClick={handleViewOnMaps}
                className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
              >
                Get Directions
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LocationMap;