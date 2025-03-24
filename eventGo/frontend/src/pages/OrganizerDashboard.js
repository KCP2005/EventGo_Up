import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganizerDashboard.css';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [ticketSales, setTicketSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    price: '',
    category: '',
    description: '',
    availableTickets: '',
    image: 'https://via.placeholder.com/400x200'
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        // Fetch events from localStorage
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        }

        // Fetch ticket sales from localStorage
        const storedTickets = localStorage.getItem('tickets');
        if (storedTickets) {
          const allTickets = JSON.parse(storedTickets);
          // Filter tickets for the current organizer
          const organizerTickets = allTickets.filter(ticket => 
            events.some(event => event.id === ticket.eventId)
          );
          setTicketSales(organizerTickets);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [events]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const eventId = `event-${Date.now()}`; // Generate a string ID
    const event = {
      ...newEvent,
      id: eventId,
      price: parseFloat(newEvent.price),
      availableTickets: parseInt(newEvent.availableTickets),
      totalTickets: parseInt(newEvent.availableTickets)
    };

    // Get existing events or initialize empty array
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Add new event
    const updatedEvents = [...existingEvents, event];
    
    // Save to localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    
    // Update state
    setEvents(updatedEvents);
    
    // Reset form and close modal
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      price: '',
      category: '',
      description: '',
      availableTickets: '',
      image: 'https://via.placeholder.com/400x200'
    });
    setShowCreateEvent(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalRevenue = () => {
    return ticketSales.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const calculateTotalTickets = () => {
    return ticketSales.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const getEventSales = (eventId) => {
    return ticketSales.filter(ticket => ticket.eventId === eventId);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="organizer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Organizer Dashboard</h1>
          <button 
            className="create-event-btn"
            onClick={() => setShowCreateEvent(true)}
          >
            Create New Event
          </button>
        </div>
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
        </div>
      </div>

      {showCreateEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowCreateEvent(false)}
            >
              ×
            </button>
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newEvent.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={newEvent.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                  <option value="food">Food</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div className="form-group">
                <label>Available Tickets</label>
                <input
                  type="number"
                  name="availableTickets"
                  value={newEvent.availableTickets}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateEvent(false)}>
                  Cancel
                </button>
                <button type="submit">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎪</div>
              <div className="stat-info">
                <h3>Total Events</h3>
                <p className="stat-value">{events.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Total Revenue</h3>
                <p className="stat-value">${calculateTotalRevenue().toFixed(2)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-info">
                <h3>Total Tickets Sold</h3>
                <p className="stat-value">{calculateTotalTickets()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Active Events</h3>
                <p className="stat-value">
                  {events.filter(event => new Date(event.date) >= new Date()).length}
                </p>
              </div>
            </div>
          </div>

          <div className="recent-sales">
            <h2>Recent Sales</h2>
            <div className="sales-list">
              {ticketSales.slice(0, 5).map(sale => {
                const event = events.find(e => e.id === sale.eventId);
                return (
                  <div key={sale.id} className="sale-item">
                    <div className="sale-info">
                      <h4>{event ? event.title : 'Unknown Event'}</h4>
                      <p>{sale.quantity} tickets - ${(sale.price * sale.quantity).toFixed(2)}</p>
                    </div>
                    <span className="sale-date">
                      {new Date(sale.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="dashboard-events">
          <div className="events-list">
            {events.map(event => {
              const eventSales = getEventSales(event.id);
              const totalRevenue = eventSales.reduce((total, sale) => 
                total + (sale.price * sale.quantity), 0
              );
              const totalTickets = eventSales.reduce((total, sale) => 
                total + sale.quantity, 0
              );

              return (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <span className="event-category">{event.category}</span>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="event-location">{event.location}</p>
                    <div className="event-stats">
                      <div className="stat">
                        <span className="label">Price:</span>
                        <span className="value">${event.price}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Available:</span>
                        <span className="value">{event.availableTickets}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Sold:</span>
                        <span className="value">{totalTickets}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Revenue:</span>
                        <span className="value">${totalRevenue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="dashboard-sales">
          <div className="sales-filters">
            <select className="filter-select">
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <select className="filter-select">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {ticketSales.map(sale => {
                  const event = events.find(e => e.id === sale.eventId);
                  return (
                    <tr key={sale.id}>
                      <td>{event ? event.title : 'Unknown Event'}</td>
                      <td>{event ? new Date(event.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{sale.quantity}</td>
                      <td>${sale.price.toFixed(2)}</td>
                      <td>${(sale.price * sale.quantity).toFixed(2)}</td>
                      <td>{new Date(sale.purchaseDate).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard; 