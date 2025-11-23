import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  Upload,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Menu
} from "lucide-react";

// --- Utility helpers ---
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const days = Math.floor(seconds / 86400);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
};

const getStatusStyle = (status) => {
  const styles = {
    OPEN: "bg-red-100 text-red-700 border-red-300",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-300",
    RESOLVED: "bg-green-100 text-green-700 border-green-300",
  };
  return styles[status] || styles.OPEN;
};

const getPriorityStyle = (priority) => {
  const styles = {
    "RED ZONE": { bg: "#DC2626", border: "#DC2626" },
    HIGH: { bg: "#FE7743", border: "#FE7743" },
    NORMAL: { bg: "#447D9B", border: "#447D9B" },
    LOW: { bg: "#D7D7D7", border: "#D7D7D7" },
  };
  return styles[priority] || styles.LOW;
};

// --- Screens ---
const AuthScreen = ({ onJumpTo }) => {
  const [aadhar, setAadhar] = useState("");
  const [mobile, setMobile] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: "#273F4F" }}
        >
          <span className="text-white text-2xl font-bold">BBMP</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bruhat Bengaluru Mahanagara Palike</h2>
        <p className="text-gray-600">Civic Issue Reporting Portal</p>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: "#D7D7D7" }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              className="flex-1 px-4 py-3 border rounded-lg"
              style={{ borderColor: "#D7D7D7" }}
            />
            <div className="px-4 py-3 bg-gray-100 text-gray-500 rounded-lg text-sm">API Call</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">SpringBoot Auth API (Login)</p>
        </div>

        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: "#D7D7D7" }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="flex-1 px-4 py-3 border rounded-lg"
              style={{ borderColor: "#D7D7D7" }}
            />
            <div className="px-4 py-3 bg-gray-100 text-gray-500 rounded-lg text-sm">OTP</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">SpringBoot Auth API (Verification)</p>
        </div>

        <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-1 w-5 h-5" />
            <div>
              <p className="text-sm font-medium text-gray-900">MANDATORY DISCLAIMER *</p>
              <p className="text-sm text-gray-700 mt-1">I agree to only post about proper civic issues and understand that misuse can result in penalties.</p>
              <p className="text-xs text-gray-500 mt-2">Frontend validation</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onJumpTo && onJumpTo(1)}
          disabled={!agreed}
          className={`w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 ${agreed ? "" : "opacity-60 cursor-not-allowed"}`}
          style={{ backgroundColor: '#FE7743' }}
        >
          Submit / Verify
        </button>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Want to view issue status only?</p>
          <button onClick={() => onJumpTo && onJumpTo(2)} className="font-medium hover:underline" style={{ color: '#447D9B' }}>
            Access Public Tracking Board →
          </button>
          <p className="text-xs text-gray-500 mt-1">Direct link to Screen 3</p>
        </div>
      </div>
    </div>
  );
};

const ReportingForm = ({ onSubmit }) => {
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Civic Issue</h2>
        <p className="text-gray-600">Fill in all required fields to submit your complaint</p>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-6 bg-blue-50" style={{ borderColor: '#447D9B' }}>
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} /> GPS Location *
            </label>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Acquired</span>
          </div>
          <button className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90" style={{ backgroundColor: '#447D9B' }}>
            Capture High-Accuracy Location
          </button>
          <p className="text-xs text-gray-600 mt-2">Requirement: Geotagging | Shows: Lat/Long coordinates</p>
          <div className="mt-3 p-3 bg-white rounded border text-sm font-mono">{location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</div>
        </div>

        <div className="border-2 border-dashed rounded-lg p-6 bg-orange-50" style={{ borderColor: '#FE7743' }}>
          <label className="font-semibold text-gray-900 flex items-center gap-2 mb-3"><Camera size={20} /> Photo Proof *</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="py-8 bg-white border-2 border-dashed rounded-lg hover:opacity-80 flex flex-col items-center justify-center cursor-pointer" style={{ borderColor: '#D7D7D7' }}>
              <Camera size={32} className="mb-2 text-gray-400" />
              <span className="text-sm text-gray-600">Take Photo</span>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="hidden" />
            </label>
            <label className="py-8 bg-white border-2 border-dashed rounded-lg hover:opacity-80 flex flex-col items-center justify-center cursor-pointer" style={{ borderColor: '#D7D7D7' }}>
              <Upload size={32} className="mb-2 text-gray-400" />
              <span className="text-sm text-gray-600">Upload Image</span>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-2">Requirement: Photo proof | Shows preview after capture</p>
        </div>

        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#D7D7D7' }}>
          <label className="block font-semibold text-gray-900 mb-3">Issue Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border rounded-lg" style={{ borderColor: '#D7D7D7' }}>
            <option value="">Select category...</option>
            <option value="road_damage">Road Damage / Potholes</option>
            <option value="garbage_dumping">Garbage Collection</option>
            <option value="street_lights">Street Lights</option>
            <option value="water_supply">Water Supply</option>
            <option value="drainage">Drainage / Sewage</option>
            <option value="public_property">Public Property Damage</option>
          </select>
          <p className="text-xs text-gray-600 mt-2">Requirement: Filtering & Routing to appropriate department</p>
        </div>

        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#D7D7D7' }}>
          <label className="block font-semibold text-gray-900 mb-3">Description *</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." className="w-full px-4 py-3 border rounded-lg" style={{ borderColor: '#D7D7D7' }} />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-600">Requirement: Detailed context | Voice recording supported</p>
            <button className="text-sm hover:underline" style={{ color: '#447D9B' }}>🎤 Voice Input</button>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onSubmit && onSubmit({ location, category, description, photo })}
            className="w-full py-4 text-white font-bold rounded-lg hover:opacity-90 text-lg"
            style={{ backgroundColor: '#FE7743' }}
          >
            Submit Complaint
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">Disabled until GPS, Photo, and Disclaimer are complete | API Submission</p>
        </div>

        <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4 text-center">
          <CheckCircle size={48} className="mx-auto mb-2" style={{ color: '#447D9B' }} />
          <h3 className="font-bold text-gray-900 mb-1">Success!</h3>
          <p className="text-sm text-gray-700">Your complaint has been registered</p>
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-xs text-gray-600 mb-1">Docket Number</p>
            <p className="text-xl font-bold text-gray-900">BBMP-2025-001234</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Requirement: Tracking via unique ID</p>
        </div>
      </div>
    </div>
  );
};

const TrackingBoard = ({ onOpenIssue }) => {
  const [issues, setIssues] = useState([
    { id: 'BBMP-2025-1001', category: 'road_damage', description: 'Large pothole at the main junction.', status: 'IN_PROGRESS', priority: 'RED ZONE', reporter: 'Citizen A', duplicateCount: 52, latitude: 12.9716, longitude: 77.5946, createdAt: '2025-11-01T09:00:00Z', assignedOfficer: 'Role Engg South', officerContact: 'engg_south@bbmp.gov.in' },
    { id: 'BBMP-2025-1002', category: 'garbage_dumping', description: 'Overflowing community bin near school.', status: 'OPEN', priority: 'HIGH', reporter: 'Citizen B', duplicateCount: 15, latitude: 12.98, longitude: 77.6, createdAt: '2025-11-02T14:30:00Z', assignedOfficer: 'Role Health East', officerContact: 'health_east@bbmp.gov.in' },
    { id: 'BBMP-2025-1003', category: 'water_leak', description: 'Minor leak near gate.', status: 'RESOLVED', priority: 'NORMAL', reporter: 'Citizen C', duplicateCount: 1, latitude: 12.965, longitude: 77.585, createdAt: '2025-11-03T08:15:00Z', assignedOfficer: 'Role Water Central', officerContact: 'water_central@bbmp.gov.in' },
    { id: 'BBMP-2025-1004', category: 'road_damage', description: 'Missing manhole cover.', status: 'OPEN', priority: 'HIGH', reporter: 'Citizen D', duplicateCount: 12, latitude: 12.975, longitude: 77.61, createdAt: '2025-11-04T11:00:00Z', assignedOfficer: 'Role Engg East', officerContact: 'engg_east@bbmp.gov.in' },
    { id: 'BBMP-2025-1005', category: 'forestry', description: 'Large branch hanging precariously.', status: 'OPEN', priority: 'LOW', reporter: 'Citizen E', duplicateCount: 3, latitude: 12.99, longitude: 77.59, createdAt: '2025-11-04T18:00:00Z', assignedOfficer: 'Role Forestry North', officerContact: 'forestry_north@bbmp.gov.in' },
  ]);

  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [filteredIssues, setFilteredIssues] = useState(issues);

  const issueCategories = [
    { value: 'road_damage', label: 'Road Damage' },
    { value: 'garbage_dumping', label: 'Garbage Dumping' },
    { value: 'water_leak', label: 'Water Leakage' },
    { value: 'unauthorized_construction', label: 'Construction' },
    { value: 'forestry', label: 'Fallen Trees' },
  ];

  useEffect(() => {
    let updatedList = [...issues]; // do not mutate original array

    if (filters.status) {
      updatedList = updatedList.filter((issue) => issue.status === filters.status);
    }

    if (filters.category) {
      updatedList = updatedList.filter((issue) => issue.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      updatedList = updatedList.filter((issue) =>
        issue.id.toLowerCase().includes(searchLower) || issue.description.toLowerCase().includes(searchLower)
      );
    }

    updatedList.sort((a, b) => {
      const priorityOrder = { 'RED ZONE': 4, HIGH: 3, NORMAL: 2, LOW: 1 };
      const pa = priorityOrder[a.priority] ?? 0;
      const pb = priorityOrder[b.priority] ?? 0;
      const priorityDiff = pb - pa;
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredIssues(updatedList);
  }, [issues, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => setFilters({ status: '', category: '', search: '' });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Tracking Board</h2>
        <p className="text-gray-600">View all reported civic issues and their status</p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-4 mb-6 bg-gray-50" style={{ borderColor: '#D7D7D7' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><Search size={16} className="inline mr-1" /> Search</label>
            <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Docket ID or keywords..." className="w-full px-3 py-2 border rounded" style={{ borderColor: '#D7D7D7' }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded" style={{ borderColor: '#D7D7D7' }}>
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><Filter size={16} className="inline mr-1" /> Category Filter</label>
            <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded" style={{ borderColor: '#D7D7D7' }}>
              <option value="">All Categories</option>
              {issueCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Showing {filteredIssues.length} of {issues.length} issues</p>
          <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium rounded hover:opacity-80" style={{ backgroundColor: '#D7D7D7', color: '#273F4F' }}>Clear Filters</button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => {
            const priorityStyle = getPriorityStyle(issue.priority);
            return (
              <div key={issue.id} className="border-2 rounded-lg p-5 bg-white hover:shadow-lg transition-shadow" style={{ borderLeftWidth: '4px', borderLeftColor: priorityStyle.border }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{issue.id}</h3>
                      {issue.priority === 'RED ZONE' && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">🚨 RED ZONE</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center"><MapPin className="w-4 h-4 mr-1" />{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor: priorityStyle.bg }}>{issue.priority}</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(issue.status)}`}>{issue.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <p className="text-base text-gray-700 font-medium mb-3">{issue.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 border-t pt-3">
                  <p className="flex items-center"><span className="font-medium">Category:</span><span className="ml-2 capitalize">{issue.category.replace('_', ' ')}</span></p>
                  <p className="flex items-center"><Clock className="w-4 h-4 mr-1" /><span className="font-medium">{timeAgo(issue.createdAt)}</span></p>
                  <p className="flex items-center"><span className="font-medium">Duplicates:</span><span className="ml-2 font-bold" style={{ color: issue.duplicateCount > 20 ? '#DC2626' : '#447D9B' }}>{issue.duplicateCount}</span></p>
                  <p className="flex items-center"><span className="font-medium">Authority:</span><span className="ml-2">{issue.assignedOfficer}</span></p>
                  <p className="col-span-2 text-xs italic text-gray-500">Contact: {issue.officerContact}</p>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={() => onOpenIssue && onOpenIssue(issue)} className="px-3 py-2 rounded bg-gray-100 hover:opacity-90">View</button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-10 bg-white rounded-lg border-2" style={{ borderColor: '#D7D7D7' }}>
            <AlertTriangle className="w-12 h-12 mx-auto mb-3" style={{ color: '#FE7743' }} />
            <p className="text-lg font-medium text-gray-700">No issues match your current filters.</p>
            <button onClick={clearFilters} className="mt-4 px-6 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: '#447D9B' }}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

const IssueDetail = ({ issue }) => {
  // Accept an issue prop; show placeholder when none
  const data = issue ?? {
    id: 'BBMP-2025-001234',
    latitude: 12.9716,
    longitude: 77.5946,
    description: 'Large pothole approximately 3 feet wide on MG Road near Trinity Circle. Creating traffic hazard and risk for two-wheelers. Water accumulation during rain.',
    duplicateCount: 12,
    assignedOfficer: 'HOD Engineering - South Zone',
    officerContact: 'south.engg@bbmp.gov.in',
    createdAt: '2025-11-05T10:30:00Z',
    category: 'road_damage',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button className="hover:underline mb-3 text-sm" style={{ color: '#447D9B' }}>← Back to Tracking Board</button>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Details</h2>
            <p className="text-lg font-semibold text-gray-700">{data.id}</p>
          </div>
          <span className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full">🚨 RED ZONE - {data.duplicateCount} Duplicates</span>
        </div>
      </div>

      <div className="border-2 border-dashed rounded-lg p-6 bg-blue-50 mb-6" style={{ borderColor: '#447D9B' }}>
        <div className="flex items-center gap-2 mb-3"><MapPin size={20} style={{ color: '#447D9B' }} /><h3 className="font-bold text-gray-900">Location Map</h3></div>
        <div className="bg-white rounded-lg p-8 text-center border-2" style={{ borderColor: '#D7D7D7' }}>
          <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
          <p className="text-gray-600">Embeddable Map (BBMP GIS Integration)</p>
          <p className="text-sm text-gray-500 mt-2">Lat: {data.latitude}° N | Long: {data.longitude}° E</p>
          <p className="text-sm font-semibold mt-2">MG Road, Trinity Circle</p>
        </div>
        <p className="text-xs text-gray-600 mt-2">Requirements: Geotagging, Location visualization</p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-6 bg-orange-50 mb-6" style={{ borderColor: '#FE7743' }}>
        <h3 className="font-bold text-gray-900 mb-4">Initial Report Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <Camera style={{ color: '#FE7743' }} className="mb-2" size={32} />
            <p className="text-sm text-gray-600">Photo Proof</p>
            <div className="mt-2 h-32 bg-gray-200 rounded flex items-center justify-center"><span className="text-gray-500">Image Preview</span></div>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-600">Reported By</p><p className="font-semibold">Citizen (Verified via Aadhar)</p></div>
            <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-600">Timestamp</p><p className="font-semibold">Nov 5, 2025 - 10:30 AM</p></div>
            <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-600">Category</p><p className="font-semibold">Road Damage / Potholes</p></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 mt-4"><p className="text-sm font-semibold text-gray-900 mb-2">Description</p><p className="text-sm text-gray-700">{data.description}</p></div>
        <p className="text-xs text-gray-600 mt-2">Requirements: Authenticity, Photo proof, GPS, Timestamp, Full description</p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-6" style={{ borderColor: '#D7D7D7' }}>
        <h3 className="font-bold text-gray-900 mb-4">Assigned Authority</h3>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3"><User style={{ color: '#273F4F' }} size={24} /><div><p className="font-bold text-gray-900">{data.assignedOfficer}</p><p className="text-sm text-gray-600">Role-based assignment</p></div></div>
          <div className="space-y-2"><p className="text-sm"><span className="font-semibold">Contact:</span> {data.officerContact}</p><p className="text-sm"><span className="font-semibold">Zone:</span> South Zone (Zones 3, 4, 5)</p></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Requirements: Role-based continuity, Follow-up contact</p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50 mb-6" style={{ borderColor: '#273F4F' }}>
        <h3 className="font-bold text-gray-900 mb-4">Resolution Timeline</h3>
        <div className="space-y-4">
          <div className="flex gap-4"><div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#447D9B' }}></div><div className="w-0.5 h-full" style={{ backgroundColor: '#D7D7D7' }}></div></div><div className="pb-4"><p className="font-semibold text-sm">Issue Reported</p><p className="text-xs text-gray-600">Nov 5, 2025 - 10:30 AM</p><p className="text-sm text-gray-700 mt-1">Status: Open</p></div></div>
          <div className="flex gap-4"><div className="flex flex-col items-center"><div className="w-3 h-3 bg-yellow-600 rounded-full"></div><div className="w-0.5 h-full" style={{ backgroundColor: '#D7D7D7' }}></div></div><div className="pb-4"><p className="font-semibold text-sm">Complaint Accepted</p><p className="text-xs text-gray-600">Nov 6, 2025 - 9:00 AM</p><p className="text-sm text-gray-700 mt-1">By: Official Ramesh Kumar (South Zone)</p></div></div>
          <div className="flex gap-4"><div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FE7743' }}></div></div><div><p className="font-semibold text-sm">In Progress</p><p className="text-xs text-gray-600">Nov 7, 2025 - 11:00 AM</p><p className="text-sm text-gray-700 mt-1">Status: Team deployed for assessment</p></div></div>
        </div>
        <p className="text-xs text-gray-600 mt-4">Requirements: Resolution tracking, Status updates, Transparency</p>
      </div>

      <div className="mt-6 border-2 border-red-300 bg-red-50 rounded-lg p-4">
        <div className="flex items-center justify-between"><div><p className="font-bold text-gray-900">Duplicate Reports Detected</p><p className="text-sm text-gray-600">Multiple citizens reported the same issue</p></div><div className="text-center"><div className="text-3xl font-bold text-red-600">{data.duplicateCount}</div><p className="text-xs text-gray-600">Similar reports</p></div></div>
        <p className="text-xs text-gray-500 mt-2">Requirement: Transparency, Duplication detection justifying RED ZONE status</p>
      </div>
    </div>
  );
};

const OfficialDashboard = ({ assigned = 'South Zone' }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-start"><div><h2 className="text-2xl font-bold text-gray-900 mb-2">Official Management Dashboard</h2><p className="text-gray-600">HOD Engineering - {assigned}</p></div><button className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"><Menu size={20} />Menu</button></div>

      <div className="border-2 border-dashed rounded-lg p-4 mb-6 bg-blue-50" style={{ borderColor: '#447D9B' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Zone</label>
            <select className="w-full px-3 py-2 border rounded bg-white" style={{ borderColor: '#D7D7D7' }}>
              <option>South Zone (My Assignment)</option>
              <option disabled>Other zones restricted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select className="w-full px-3 py-2 border rounded bg-white" style={{ borderColor: '#D7D7D7' }}>
              <option>Open Issues (3)</option>
              <option>In Progress (5)</option>
              <option>Resolved (12)</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Requirement: Routing - Officials only see their assigned role/area</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-100 rounded-lg p-4 text-center border-2 border-red-200"><div className="text-3xl font-bold text-red-600">3</div><p className="text-sm text-gray-700">Open Issues</p></div>
        <div className="bg-yellow-100 rounded-lg p-4 text-center border-2 border-yellow-200"><div className="text-3xl font-bold text-yellow-600">5</div><p className="text-sm text-gray-700">In Progress</p></div>
        <div className="bg-green-100 rounded-lg p-4 text-center border-2 border-green-200"><div className="text-3xl font-bold text-green-600">12</div><p className="text-sm text-gray-700">Resolved</p></div>
        <div className="rounded-lg p-4 text-center border-2" style={{ backgroundColor: 'rgba(68, 125, 155, 0.2)', borderColor: '#447D9B' }}><div className="text-3xl font-bold" style={{ color: '#273F4F' }}>20</div><p className="text-sm text-gray-700">Total</p></div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Assigned Issues - Open</h3>
        <div className="border-2 border-red-400 rounded-lg p-5 bg-white">
          <div className="flex justify-between items-start mb-4"><div><span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">🚨 RED ZONE - 12 Duplicates</span><h4 className="font-bold text-gray-900 mt-2 text-lg">BBMP-2025-001234</h4><p className="text-sm text-gray-600 mt-1">Large pothole on MG Road near Trinity Circle</p></div><div className="flex items-center gap-2 text-red-600"><Clock size={20} /><span className="font-bold">18h left</span></div></div>

          <div className="flex items-center gap-4 text-xs text-gray-600 mb-4"><span>📍 MG Road, Zone 3</span><span>📂 Road Damage</span><span>📅 Nov 5, 2025</span></div>

          <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50" style={{ borderColor: '#D7D7D7' }}>
            <p className="text-xs font-semibold text-gray-700 mb-3">Available Actions:</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-white rounded font-medium hover:opacity-90" style={{ backgroundColor: '#447D9B' }}>Accept Complaint</button>
              <button className="px-4 py-2 text-white rounded font-medium hover:opacity-90" style={{ backgroundColor: '#FE7743' }}>Update Status</button>
              <button className="px-4 py-2 text-white rounded font-medium hover:opacity-90" style={{ backgroundColor: '#273F4F' }}>Mark Resolved</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Requirement: Status update, Accountability</p>
          </div>

          <div className="mt-4 border-2 bg-orange-50 rounded-lg p-3" style={{ borderColor: '#FE7743' }}>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><AlertTriangle style={{ color: '#FE7743' }} size={20} /><span className="font-semibold text-gray-900">Penalty Deadline</span></div><div className="text-right"><div className="text-xl font-bold" style={{ color: '#FE7743' }}>18:24:35</div><p className="text-xs text-gray-600">Time remaining</p></div></div>
            <p className="text-xs text-gray-500 mt-2">Requirement: Penalty logic, Visual timer for accountability</p>
          </div>
        </div>

        {/* other cards omitted for brevity; add as needed */}
      </div>

      <div className="mt-6 border-2 border-dashed rounded-lg p-6 bg-blue-50" style={{ borderColor: '#447D9B' }}>
        <h3 className="font-bold text-gray-900 mb-4">Resolution Notes / Documentation</h3>
        <textarea rows={4} placeholder="Document the resolution process, actions taken, team deployed, materials used, etc..." className="w-full px-4 py-3 border rounded-lg" style={{ borderColor: '#D7D7D7' }} />
        <div className="flex justify-between items-center mt-3"><p className="text-xs text-gray-600">Requirement: Transparency, Logging for public visibility</p><button className="px-6 py-2 text-white rounded font-medium hover:opacity-90" style={{ backgroundColor: '#447D9B' }}>Save Notes</button></div>
      </div>
    </div>
  );
};

// --- Main wireframe component ---
const BBMPWireframes = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [openIssue, setOpenIssue] = useState(null);

  const screens = [
    { name: "Screen 1: Authentication & Disclaimer", component: <AuthScreen onJumpTo={setCurrentScreen} /> },
    { name: "Screen 2: Issue Reporting Form", component: <ReportingForm onSubmit={() => setCurrentScreen(2)} /> },
    { name: "Screen 3: Public Tracking Board", component: <TrackingBoard onOpenIssue={(i) => { setOpenIssue(i); setCurrentScreen(3); }} /> },
    { name: "Screen 4: Issue Detail View", component: <IssueDetail issue={openIssue} /> },
    { name: "Screen 5: Official Dashboard", component: <OfficialDashboard /> },
  ];

  const prev = () => setCurrentScreen((s) => Math.max(0, s - 1));
  const next = () => setCurrentScreen((s) => Math.min(screens.length - 1, s + 1));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BBMP Civic Issue Reporting System</h1>
          <p className="text-gray-600">Interactive Wireframe Blueprint</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <button onClick={prev} disabled={currentScreen === 0} style={{ backgroundColor: currentScreen === 0 ? '#D7D7D7' : '#FE7743' }} className="flex items-center gap-2 px-4 py-2 text-white rounded disabled:cursor-not-allowed hover:opacity-90">
              <ChevronLeft size={20} /> Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Screen {currentScreen + 1} of {screens.length}</div>
              <div className="font-semibold text-gray-900">{screens[currentScreen].name}</div>
            </div>

            <button onClick={next} disabled={currentScreen === screens.length - 1} style={{ backgroundColor: currentScreen === screens.length - 1 ? '#D7D7D7' : '#FE7743' }} className="flex items-center gap-2 px-4 py-2 text-white rounded disabled:cursor-not-allowed hover:opacity-90">
              Next <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {screens.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentScreen(idx)} style={{ backgroundColor: idx === currentScreen ? '#FE7743' : '#D7D7D7' }} className="w-3 h-3 rounded-full transition-colors" aria-label={`Go to screen ${idx + 1}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">{screens[currentScreen].component}</div>
      </div>
    </div>
  );
};

export default BBMPWireframes;
