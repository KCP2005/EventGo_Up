import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    date: 'all',
    price: 'all',
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = () => {
      try {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
          setFilteredEvents(parsedEvents);
        }
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter
    if (filters.date !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        switch (filters.date) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return eventDate.toDateString() === tomorrow.toDateString();
          case 'this-week':
            return eventDate <= nextWeek;
          default:
            return true;
        }
      });
    }

    // Apply price filter
    if (filters.price !== 'all') {
      filtered = filtered.filter(event => {
        switch (filters.price) {
          case 'free':
            return event.price === 0;
          case 'under-50':
            return event.price < 50;
          case '50-100':
            return event.price >= 50 && event.price <= 100;
          case 'over-100':
            return event.price > 100;
          default:
            return true;
        }
      });
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => 
        event.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Events</h1>
        <button 
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
            </select>
            <select
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="food">Food</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
            </select>
          </div>
        </div>
      )}

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <h2>No Events Found</h2>
            <p>Try adjusting your filters or check back later for new events.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} />
                <div className="event-category">{event.category}</div>
              </div>
              <div className="event-info">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <p><i className="fas fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</p>
                  <p><i className="fas fa-clock"></i> {event.time}</p>
                  <p><i className="fas fa-map-marker-alt"></i> {event.location}</p>
                  <p><i className="fas fa-ticket-alt"></i> {event.availableTickets} tickets left</p>
                </div>
                <div className="event-price">
                  <span>${event.price}</span>
                  <button 
                    className="view-event-btn"
                    onClick={() => handleViewEvent(event.id)}
                  >
                    View Event
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events; 