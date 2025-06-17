import React, { useEffect, useState } from "react";
import { 
  FiChevronLeft, FiChevronRight, FiFilter, FiSearch, FiMail, 
  FiPhone, FiUser, FiClock, FiMessageSquare, FiTrash2, FiCalendar 
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'read', 'unread'
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/contact-messages/`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
        setFilteredMessages(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [apiUrl]);

  // Apply filters and search
  useEffect(() => {
    let result = messages;
    
    // Apply read/unread filter
    if (filter === 'read') {
      result = result.filter(msg => msg.is_read);
    } else if (filter === 'unread') {
      result = result.filter(msg => !msg.is_read);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(msg => 
        msg.name.toLowerCase().includes(term) || 
        msg.email.toLowerCase().includes(term) ||
        (msg.phone && msg.phone.includes(term)) ||
        (msg.subject && msg.subject.toLowerCase().includes(term))) ||
        msg.message.toLowerCase().includes(term)
    }
    
    // Apply date filter
    if (startDate && endDate) {
      result = result.filter(msg => {
        const msgDate = new Date(msg.created_at);
        return msgDate >= startDate && msgDate <= endDate;
      });
    } else if (startDate) {
      result = result.filter(msg => new Date(msg.created_at) >= startDate);
    } else if (endDate) {
      result = result.filter(msg => new Date(msg.created_at) <= endDate);
    }
    
    setFilteredMessages(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [messages, filter, searchTerm, startDate, endDate]);

  // Calculate pagination
  const totalMessages = filteredMessages.length;
  const totalPages = Math.ceil(totalMessages / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    // Mark as read when viewing
    if (!message.is_read) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? {...msg, is_read: true} : msg
      ));
    }
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/contact-messages/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      
      setMessages(messages.filter(msg => msg.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7bbf42]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Contact Messages</h2>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7bbf42] focus:border-[#7bbf42] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Filter:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7bbf42] focus:border-[#7bbf42] outline-none transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FiCalendar className="text-gray-600" />
            <span>Date Filter</span>
          </button>
        </div>
      </div>

      {/* Date Filter Dropdown */}
      {showDateFilter && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7bbf42] focus:border-[#7bbf42] outline-none transition"
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7bbf42] focus:border-[#7bbf42] outline-none transition"
                placeholderText="Select end date"
              />
            </div>
          </div>
          {(startDate || endDate) && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={resetDateFilter}
                className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
              >
                Clear Date Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-[#7bbf42] to-[#f9b414] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentMessages.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No messages found matching your criteria.
                </td>
              </tr>
            ) : (
              currentMessages.map((message) => (
                <tr
                  key={message.id}
                  className={`hover:bg-gray-50 transition duration-150 ease-in-out ${
                    !message.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      message.is_read ? "bg-gray-400" : "bg-blue-500"
                    }`}></span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#7bbf42] rounded-full flex items-center justify-center text-white font-bold">
                        {message.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                        <div className="text-sm text-gray-500">{message.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 font-medium">{message.subject || 'No subject'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{message.message}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="text-[#7bbf42] hover:text-[#6aa638] font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(message.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstMessage + 1} to {Math.min(indexOfLastMessage, totalMessages)} of {totalMessages} messages
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-[#7bbf42] text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    } transition`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">Message Details</h3>
                <button
                  onClick={handleCloseDetail}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-[#7bbf42] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">{selectedMessage.name}</h4>
                    <p className="text-gray-600">{selectedMessage.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FiPhone className="mr-2" />
                      <span>Phone</span>
                    </div>
                    <p className="text-gray-900">{selectedMessage.phone || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FiClock className="mr-2" />
                      <span>Received</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FiMessageSquare className="mr-2" />
                    <span>Subject</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedMessage.subject || 'No subject'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FiMail className="mr-2" />
                    <span>Message</span>
                  </div>
                  <p className="text-gray-900 whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    setDeleteConfirm(selectedMessage.id);
                    handleCloseDetail();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete Message
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="px-4 py-2 bg-[#7bbf42] text-white rounded-lg hover:bg-[#6aa638] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;