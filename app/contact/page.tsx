"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/Home/Footer";
import { ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    topic: "Custom Device Inquiry",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const topics = [
    "Custom Device Inquiry",
    "Authentication (IMEI)",
    "Warranty Claims",
    "General Inquiry"
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTopicSelect = (topic: string) => {
    setFormData({ ...formData, topic });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          topic: formData.topic,
          message: formData.message,
        }]);
        
      if (error) throw error;
      toast.success("Inquiry submitted successfully", { 
        style: { borderRadius: 0, border: '1px solid #000', background: '#fff', color: '#000', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }
      });
      setFormData({
        fullName: "",
        email: "",
        topic: "Custom Device Inquiry",
        message: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border-b border-[#EAEAEA] bg-transparent px-0 py-4 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors font-light text-sm rounded-none";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Editorial Statement */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] text-black leading-tight mb-8">
                Client Relations
              </h1>
              <div className="h-[1px] w-12 bg-[#EAEAEA] mb-8"></div>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm tracking-wide">
                Experience uncompromising service. For inquiries regarding 24K Gold customized devices, product authentication, or global warranty assistance, our dedicated concierges are at your service.
              </p>
            </div>
            
            <div className="mt-16 lg:mt-24">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-light">Direct Contact</h3>
              <p className="text-sm font-light text-black tracking-widest">oroxlabs@gmail.com</p>
            </div>
          </div>

          {/* Right Column - The Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-12">
              {errorMsg && (
                <div className="text-red-400 text-[10px] uppercase tracking-[0.2em] font-light border border-red-200 p-4">
                  {errorMsg}
                </div>
              )}
              
              {/* Topic Selection */}
              <div>
                <label className="block text-[10px] font-light uppercase tracking-[0.3em] text-gray-400 mb-6">Select Category</label>
                <div className="flex flex-wrap gap-3">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTopicSelect(t)}
                      className={`py-3 px-6 text-[9px] uppercase tracking-[0.2em] font-light transition-all duration-300 border ${
                        formData.topic === t 
                          ? "bg-[#F9F9F9] text-black border-black" 
                          : "bg-transparent text-gray-400 border-[#EAEAEA] hover:border-black hover:text-black"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Provide details regarding your inquiry..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={1}
                  className={`${inputClass} resize-none min-h-[120px]`}
                />
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-between items-center bg-transparent border border-black text-black px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-light hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
                >
                  <span>{loading ? "Transmitting..." : "Submit Inquiry"}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
