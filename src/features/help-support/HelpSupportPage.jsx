import { useState } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Video,
  Star,
} from "lucide-react";
import Button from "../../shared/components/Button.jsx";

export default function HelpSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Static help content
  const helpContent = {
    overview: {
      title: "TikTok Database Management System",
      description:
        "Welcome to the TikTok Database Management System. This platform helps you manage keywords, search topics, explore topics, and user accounts for TikTok content analysis.",
      sections: [
        {
          title: "Getting Started",
          content:
            "To get started, navigate through the sidebar menu to access different features of the system.",
        },
        {
          title: "Keywords Management",
          content:
            "Manage keywords and their popularity metrics. Create, edit, and delete keywords to track trending topics.",
        },
        {
          title: "Search Topics",
          content:
            "Create and manage search topics with detailed information, AI tips, and quick actions.",
        },
        {
          title: "Explore Topics",
          content:
            "Manage explore topics that appear in the TikTok explore page.",
        },
        {
          title: "User Management",
          content:
            "Manage user accounts and their roles (Admin, Editor, Viewer, Super Admin).",
        },
      ],
    },
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(
      "Contact form submitted! (This is a demo - no actual message was sent)"
    );
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const sections = [
    { id: "overview", label: "Overview", icon: HelpCircle },
    { id: "getting-started", label: "Getting Started", icon: BookOpen },
    { id: "features", label: "Features", icon: Star },
    { id: "troubleshooting", label: "Troubleshooting", icon: Search },
    { id: "contact", label: "Contact Support", icon: MessageCircle },
  ];

  const quickLinks = [
    {
      title: "User Guide",
      description: "Complete guide to using the dashboard",
      icon: BookOpen,
      href: "/help/user-guide",
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: FileText,
      href: "/help/api-docs",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: Video,
      href: "/help/videos",
    },
    {
      title: "FAQ",
      description: "Frequently asked questions",
      icon: HelpCircle,
      href: "/help/faq",
    },
  ];

  const faqs = [
    {
      question: "How do I create a new keyword?",
      answer:
        "Navigate to the Keywords page and click the 'Add Keyword' button. Fill in the required information and save.",
    },
    {
      question: "How do I manage user permissions?",
      answer:
        "Go to the Users page and edit a user's profile to change their role and permissions.",
    },
    {
      question: "How do I generate reports?",
      answer:
        "Visit the Reports page and select the type of report you want to generate. Choose your date range and click 'Generate Report'.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Go to Security settings and use the 'Change Password' section to update your password.",
    },
    {
      question: "How do I export data?",
      answer:
        "Most pages have an 'Export' button in the top-right corner. Click it to download your data in various formats.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
              Help & Support
            </h1>
            <p className="mt-2 text-gray-600">
              Get help, find answers, and connect with our support team
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                    activeSection === section.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview */}
      {activeSection === "overview" && (
        <div className="space-y-8">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(link.href, "_blank")}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              );
            })}
          </div>

          {/* Getting Started */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Getting Started
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Set up your account
                  </h4>
                  <p className="text-sm text-gray-600">
                    Complete your profile and configure your preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Import your data
                  </h4>
                  <p className="text-sm text-gray-600">
                    Upload your TikTok data or start adding content manually
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Organize and manage
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use keywords, tags, and categories to organize your content
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Analyze and report
                  </h4>
                  <p className="text-sm text-gray-600">
                    Generate reports and analyze your content performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      {activeSection === "getting-started" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Getting Started Guide
          </h3>
          <div className="prose max-w-none">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to TikTok Database
                </h4>
                <p className="text-gray-600">
                  This dashboard helps you manage and analyze your TikTok
                  content effectively. Follow this guide to get the most out of
                  your experience.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Key Features
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Manage keywords and search topics</li>
                  <li>Track trending content and hashtags</li>
                  <li>Generate detailed analytics reports</li>
                  <li>Organize content with tags and categories</li>
                  <li>Manage user accounts and permissions</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Navigation
                </h4>
                <p className="text-gray-600">
                  Use the sidebar to navigate between different sections. Each
                  page is designed for specific tasks and provides relevant
                  tools and information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeSection === "troubleshooting" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support */}
      {activeSection === "contact" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <Button size="sm">Start Chat</Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Send us a detailed message
              </p>
              <Button size="sm" variant="outline">
                Send Email
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phone Support
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Call us for urgent issues
              </p>
              <Button size="sm" variant="outline">
                Call Now
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Features */}
      {activeSection === "features" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Feature Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Content Management
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keywords and search topics</li>
                <li>• Video and media library</li>
                <li>• Tags and categories</li>
                <li>• Content organization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Analytics & Reporting
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Performance metrics</li>
                <li>• Trending analysis</li>
                <li>• Custom reports</li>
                <li>• Data export</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                User Management
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Role-based access</li>
                <li>• User permissions</li>
                <li>• Activity tracking</li>
                <li>• Security settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                System Features
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time notifications</li>
                <li>• System settings</li>
                <li>• Backup & restore</li>
                <li>• API access</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
