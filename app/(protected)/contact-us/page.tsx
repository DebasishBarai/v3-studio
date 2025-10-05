'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Mail, FileText, Instagram, Youtube, Music2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    content: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6 py-16">
      <div className="text-card-foreground w-full max-w-5xl bg-neutral-900/70 backdrop-blur-md shadow-2xl border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Form Section */}
          <div className="p-10">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Contact Us
              </h2>
              <p className="text-neutral-400">
                We&apos;d love to hear from you! Fill out the form below, and our team will get in touch shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input */}
                <div className="flex items-center gap-2 bg-neutral-800/70 rounded-lg px-3">
                  <User className="text-neutral-400" size={24} />
                  <input
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors bg-transparent border-none text-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-0"
                    placeholder="Full Name"
                    required
                    value={formData.fullName}
                    name="fullName"
                    onChange={handleChange}
                  />
                </div>

                {/* Email Input */}
                <div className="flex items-center gap-2 bg-neutral-800/70 rounded-lg px-3">
                  <Mail className="text-neutral-400" size={24} />
                  <input
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors bg-transparent border-none text-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-0"
                    placeholder="Email Address"
                    required
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                  />
                </div>

                {/* Subject Input */}
                <div className="flex items-center gap-2 bg-neutral-800/70 rounded-lg px-3">
                  <FileText className="text-neutral-400" size={24} />
                  <input
                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors bg-transparent border-none text-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-0"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    name="subject"
                    onChange={handleChange}
                  />
                </div>

                {/* Message Textarea */}
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-0 bg-neutral-800/70 border-none text-white placeholder:text-neutral-400 h-32"
                  name="content"
                  placeholder="Your message..."
                  required
                  value={formData.content}
                  onChange={handleChange}
                />

                {/* Submit Button */}
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md"
                  type="submit"
                >
                  Send Message
                </button>
              </form>

              {/* Social Media Links */}
              <div className="flex gap-6 mt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-neutral-800 hover:bg-purple-600 transition-all duration-300"
                  aria-label="Visit our Instagram"
                >
                  <Instagram className="text-white w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-neutral-800 hover:bg-red-600 transition-all duration-300"
                  aria-label="Visit our YouTube"
                >
                  <Youtube className="text-white w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-neutral-800 hover:bg-pink-500 transition-all duration-300"
                  aria-label="Visit our TikTok"
                >
                  <Music2 className="text-white w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block w-full h-full relative">
            <Image
              alt="Contact Illustration"
              className="w-full h-full object-cover"
              src="/contact.jpg"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
